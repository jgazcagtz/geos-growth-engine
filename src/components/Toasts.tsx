import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info } from 'lucide-react';
import { useEngine } from '../state/EngineContext';

export function Toasts() {
  const { toasts } = useEngine();

  return (
    <div className="toasts" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`toast${t.tone === 'success' ? ' toast--success' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            {t.tone === 'success' ? <CheckCircle2 aria-hidden /> : <Info aria-hidden />}
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
