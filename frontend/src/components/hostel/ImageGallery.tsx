import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl" style={{ height: 380 }}>
        <button onClick={() => { setIndex(0); setOpen(true); }} className="relative col-span-2 row-span-2">
          <img src={images[0]} alt={name} className="h-full w-full object-cover" />
        </button>
        {images.slice(1, 5).map((img, i) => (
          <button key={img} onClick={() => { setIndex(i + 1); setOpen(true); }} className="relative">
            <img src={img} alt={`${name} ${i + 2}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          >
            <button onClick={() => setOpen(false)} className="absolute right-5 top-5 text-white" aria-label="Close gallery"><X size={26} /></button>
            <button onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)} className="absolute left-4 text-white sm:left-8" aria-label="Previous image"><ChevronLeft size={32} /></button>
            <motion.img
              key={index}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              src={images[index]} alt={name} className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            />
            <button onClick={() => setIndex((i) => (i + 1) % images.length)} className="absolute right-4 text-white sm:right-8" aria-label="Next image"><ChevronRight size={32} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
