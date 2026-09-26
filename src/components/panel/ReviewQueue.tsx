import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Pencil, Check, X } from 'lucide-react';
import { REVIEWS } from '../../data/reviews';
import { useEngine } from '../../state/EngineContext';

export function ReviewQueue() {
  const { reviewStatus, setReviewStatus } = useEngine();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="section">
      <div className="section-title">Review queue — 3 gated actions</div>
      {REVIEWS.map((r) => {
        const status = reviewStatus[r.id];
        const done = status !== 'pending';
        const open = expanded === r.id;

        return (
          <div key={r.id} className={`review-card${done ? ' review-card--done' : ''}`}>
            <div className="review-top">
              <strong>{r.account}</strong>
              <span className="conf">{r.confidence} confidence</span>
              <span className="impact">{r.impact}</span>
            </div>
            <div className="review-signal">{r.signal}</div>

            <div className="review-why">
              {r.whyNow.map((w) => (
                <div key={w}>{w}</div>
              ))}
            </div>

            <div className="review-rec">
              <b>AI recommendation</b>
              {r.recommended} · via {r.channel}
            </div>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="kv-list" style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 8 }}>
                    <div className="kv-item">Evidence pack: account brief, signal timeline, similar-account outcomes.</div>
                    <div className="kv-item">Draft message attached — editable before send.</div>
                    <div className="kv-item">Decision (approve / modify / dismiss) is audit-logged with your name.</div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {done ? (
              <span className={`status-badge status-badge--${status}`}>{status}</span>
            ) : (
              <div className="review-actions">
                <button type="button" className="btn btn-xs" onClick={() => setExpanded(open ? null : r.id)}>
                  <ChevronDown size={11} aria-hidden /> Review context
                </button>
                <button type="button" className="btn btn-primary btn-xs" onClick={() => setReviewStatus(r.id, 'approved')}>
                  <Check size={11} aria-hidden /> Approve
                </button>
                <button type="button" className="btn btn-xs" onClick={() => setReviewStatus(r.id, 'modified')}>
                  <Pencil size={11} aria-hidden /> Modify
                </button>
                <button type="button" className="btn btn-xs" onClick={() => setReviewStatus(r.id, 'dismissed')}>
                  <X size={11} aria-hidden /> Dismiss
                </button>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
