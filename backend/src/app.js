const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const hostelRoutes = require('./routes/hostelRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const savedRoutes = require('./routes/savedRoutes');
const compareRoutes = require('./routes/compareRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// --- Core middleware -------------------------------------------------
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,https://*.vercel.app,https://*.netlify.app').split(',');
app.use(cors({ origin: true, credentials: true }));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', apiLimiter);

// --- Health check ------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'HostelMate API is running', time: new Date().toISOString() });
});

// --- Routes --------------------------------------------------------------
app.use('/api/hostels', hostelRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
