import { motion, AnimatePresence } from 'framer-motion';

export function CountdownOverlay({ value }: { value: number }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pixel-dark/80">
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="text-pixel-gold font-pixel"
          style={{ fontSize: '120px' }}
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
