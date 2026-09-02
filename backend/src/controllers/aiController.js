const Hostel = require('../models/Hostel');

/**
 * POST /api/ai/chat
 * Groq Llama-3 AI Assistant Controller with dataset context and smart fallback
 */
exports.chatWithAI = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query string is required' });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    
    // Retrieve hostels from DB for context
    let hostels = [];
    try {
      hostels = await Hostel.find().limit(12).lean();
    } catch (e) {
      hostels = [];
    }

    const hostelSummary = hostels.map(h => 
      `• ${h.name} (${h.gender} PG, ${h.locality}, ${h.city}): ₹${h.price}/mo, ${h.rating}★ rating, Amenities: ${h.facilities ? h.facilities.join(', ') : 'Wi-Fi, AC'}, Food: ${h.food?.included ? 'Included' : 'Extra'}`
    ).join('\n');

    if (groqApiKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
            messages: [
              {
                role: 'system',
                content: `You are HostelMate AI, an expert student accommodation advisor in India (Hyderabad, Bangalore, Delhi, Pune, Mumbai). Answer student queries concisely, accurately, and politely. Help them find hostels based on budget, food quality, distance, safety, and amenities.\n\nCurrent Featured Hostels in Database:\n${hostelSummary}`
              },
              { role: 'user', content: query }
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          return res.json({
            success: true,
            reply: data.choices[0].message.content,
            source: 'groq-ai',
          });
        }
      } catch (err) {
        console.error('Groq API Call Error:', err.message);
      }
    }

    // Smart fallback if GROQ_API_KEY is omitted or unreachable
    const q = query.toLowerCase();
    const matched = hostels.filter(h => {
      if (q.includes('girl') || q.includes('women') || q.includes('ladies')) return h.gender === 'girls';
      if (q.includes('boy') || q.includes('men')) return h.gender === 'boys';
      return true;
    }).slice(0, 3);

    return res.json({
      success: true,
      reply: `Here are the top matching hostels for "${query}":`,
      hostels: matched,
      source: 'smart-dataset',
    });
  } catch (error) {
    next(error);
  }
};
