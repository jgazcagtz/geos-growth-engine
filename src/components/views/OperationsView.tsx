import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  BellRing,
  CircleCheck,
  Compass,
  FlaskConical,
  Handshake,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { OpEvent, OpKind } from '../../types';
import { OPS_SUMMARY, OPS_TEMPLATES } from '../../data/ops';
import { REVIEWS, REVIEW_SLA } from '../../data/reviews';
import { HEALTH_FOCUS, WORKFLOW_MAP } from '../../data/workflows';
import { useEngine } from '../../state/EngineContext';

const KIND_ICON: Record<OpKind, LucideIcon> = {
  signal: Radio,
  qualification: Compass,
  action: Sparkles,
  approval: BellRing,
  handoff: Handshake,
  lifecycle: RefreshCw,
  experiment: FlaskConical,
  learning: Sparkles,
  error: AlertTriangle,
  sync: RefreshCw,
};

/**
 * OPERATIONS view — what is happening right now: the live feed, the approval
 * queue with SLAs, and automation health. Everything clicks through to the
 * workflow, account or review that produced it.
 */
export function OperationsView() {
  const { ops, pushOps, select, selectEdge, reviewStatus, setReviewStatus, motionAllowed, toast, t } = useEngine();
  const [paused, setPaused] = useState(false);
  const templateIdx = useRef(0);
  const feedRef = useRef<HTMLDivElement>(null);

  /* seed + live tick while this view is open */
  useEffect(() => {
    if (paused) return;
    if (ops.length === 0) {
      for (let i = 0; i < 6; i++) {
        pushOps(OPS_TEMPLATES[templateIdx.current % OPS_TEMPLATES.length]);
        templateIdx.current += 1;
      }
    }
    const t = window.setInterval(() => {
      pushOps(OPS_TEMPLATES[templateIdx.current % OPS_TEMPLATES.length]);
      templateIdx.current += 1;
    }, 3200);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, pushOps]);

  useEffect(() => {
    if (motionAllowed && feedRef.current) feedRef.current.scrollTop = 0;
  }, [ops.length, motionAllowed]);

  const openTarget = (e: OpEvent) => {
    if (!e.open) return;
    if (e.open.type === 'workflow') selectEdge(e.open.id as never);
    else select(e.open.id as never);
  };

  return (
    <main className="ops-view" aria-label="Operations — what the engine is doing right now">
      <div className="view-head">
        <div>
          <h2>{t('ops.h2')}</h2>
          <p>{t('ops.sub')}</p>
        </div>
        <div className="ops-summary">
          <Sum k={t('ops.sum.accounts')} v={OPS_SUMMARY.accountsDetected} />
          <Sum k={t('ops.sum.qualified')} v={OPS_SUMMARY.qualifiedToday} />
          <Sum k={t('ops.sum.triggers')} v={OPS_SUMMARY.triggersFired} />
          <Sum k={t('ops.sum.actions')} v={OPS_SUMMARY.actionsProposed} />
          <Sum k={t('ops.sum.approvals')} v={OPS_SUMMARY.awaitingApproval} warn />
          <Sum k={t('ops.sum.errors')} v={OPS_SUMMARY.errorsToday} warn />
        </div>
      </div>

      <div className="ops-grid">
        <section className="ops-feed-section">
          <div className="ops-feed-head">
            <span className="live-chip" aria-hidden>
              LIVE
            </span>
            <span>{t('ops.feedHead')}</span>
            <button type="button" className="btn btn-xs" onClick={() => setPaused((p) => !p)} style={{ marginLeft: 'auto' }}>
              {paused ? <Play size={10} aria-hidden /> : <Pause size={10} aria-hidden />}
              {paused ? t('ops.resumeFeed') : t('ops.pauseFeed')}
            </button>
          </div>
          <div className="ops-feed" ref={feedRef} role="log" aria-label="Live operations feed">
            <AnimatePresence initial={false}>
              {ops
                .slice()
                .reverse()
                .map((e) => {
                  const Icon = KIND_ICON[e.kind];
                  const clickable = Boolean(e.open);
                  return (
                    <motion.button
                      key={e.id}
                      type="button"
                      className={`ops-item ops-item--${e.kind}${clickable ? ' ops-item--link' : ''}`}
                      onClick={() => openTarget(e)}
                      initial={motionAllowed ? { opacity: 0, y: -8 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.24 }}
                      aria-label={clickable ? `${e.text} — open related detail` : e.text}
                    >
                      <Icon size={13} className="ops-icon" aria-hidden />
                      <span className="ops-at mono">{e.at}</span>
                      <span className="ops-text">
                        {e.account ? <b className="ops-acct">{e.account}</b> : null}
                        {e.text}
                      </span>
                      <span className={`ops-kind ops-kind--${e.kind}`}>{t(`k.${e.kind}`)}</span>
                      {clickable ? <span className="ops-open" aria-hidden>open →</span> : null}
                    </motion.button>
                  );
                })}
            </AnimatePresence>
          </div>
        </section>

        <div className="ops-side">
          <section className="ops-side-section">
            <div className="section-title">{t('ops.approvals')}</div>
            <div className="ops-reviews">
              {REVIEWS.map((r) => {
                const status = reviewStatus[r.id];
                return (
                  <div key={r.id} className={`ops-review${status !== 'pending' ? ' ops-review--done' : ''}`}>
                    <div className="ops-review-top">
                      <button type="button" className="ops-review-name" onClick={() => select('human')}>
                        {r.account}
                      </button>
                      <span className="ops-review-impact">{r.impact}</span>
                    </div>
                    <div className="ops-review-signal">{r.signal}</div>
                    <div className="ops-review-foot">
                      <span className="ops-review-sla mono">{REVIEW_SLA[r.id]}</span>
                      {status === 'pending' ? (
                        <span className="ops-review-actions">
                          <button type="button" className="btn btn-primary btn-xs" onClick={() => setReviewStatus(r.id, 'approved')}>
                            {t('ops.approve')}
                          </button>
                          <button type="button" className="btn btn-xs" onClick={() => setReviewStatus(r.id, 'dismissed')}>
                            {t('ops.dismiss')}
                          </button>
                        </span>
                      ) : (
                        <span className={`status-badge status-badge--${status}`}>{status}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="ops-side-note">
              Median time-to-decision {OPS_SUMMARY.medianDecision} · every decision audit-logged.
            </p>
          </section>

          <section className="ops-side-section">
            <div className="section-title">{t('ops.health')}</div>
            <div className="health-cards">
              {HEALTH_FOCUS.map((id) => {
                const wf = WORKFLOW_MAP[id];
                const ok = wf.health.successPct >= 98;
                return (
                  <button key={id} type="button" className="health-card" onClick={() => selectEdge(id)}>
                    <div className="health-card-head">
                      <strong>{wf.name}</strong>
                      <span className={`mono ${ok ? 'health-ok' : 'health-warn'}`}>{wf.health.successPct}%</span>
                    </div>
                    <div className="health-bar">
                      <span style={{ width: `${wf.health.successPct}%` }} className={ok ? 'health-fill-ok' : 'health-fill-warn'} />
                    </div>
                    <div className="health-meta mono">
                      {wf.health.runsToday.toLocaleString('en-US')} runs · {wf.health.failures} failed ·{' '}
                      {wf.health.escalations} escalated · {wf.health.medianRuntime} · {wf.health.llmCost}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="ops-side-note">{t('ops.healthNote')}</p>
          </section>
        </div>
      </div>

      <button
        type="button"
        className="ops-toast-note"
        onClick={() => toast('Errors page to the owner — retries and fallbacks are automatic')}
      >
        <CircleCheck size={12} aria-hidden /> {t('ops.exceptions')}
      </button>
    </main>
  );
}

function Sum({ k, v, warn }: { k: string; v: number; warn?: boolean }) {
  return (
    <div className={`ops-sum${warn ? ' ops-sum--warn' : ''}`}>
      <span className="ops-sum-v">{v}</span>
      <span className="ops-sum-k">{k}</span>
    </div>
  );
}
