import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Ban, CheckCircle2, Repeat, ThumbsDown, ThumbsUp } from 'lucide-react';
import {
  HANDOFF_BAD,
  HANDOFF_FLOW,
  HANDOFF_GOOD,
  LIFECYCLE_EVENTS,
  TRIGGER_RULE,
} from '../../data/gtm';
import { useEngine } from '../../state/EngineContext';

const STAGE_ORDER = ['signup', 'setup', 'activation', 'adoption', 'retention', 'expansion'] as const;

/** Lifecycle automation lab: behavioral event taxonomy + a live trigger rule + SDR→AE handoff. */
export function LifecycleLab() {
  const { motionAllowed, toast } = useEngine();
  const [ruleFired, setRuleFired] = useState(false);
  const [handoffMode, setHandoffMode] = useState<'bad' | 'good' | null>(null);

  const fire = () => {
    setRuleFired(true);
    toast('Trigger rule executed — intervention selected, WhatsApp nudge scheduled');
  };

  return (
    <>
      {/* ---------------- behavioral event taxonomy ---------------- */}
      <section className="section">
        <div className="section-title">Lifecycle automation — behavioral events</div>
        <p>
          Rules and AI react to real product behavior — not to “AI sends personalized onboarding.” These are the
          events the engine listens to at each stage:
        </p>
        <div className="pill-wrap">
          {LIFECYCLE_EVENTS.map((e) => (
            <span key={e.event} className={`chip lc-event lc-event--${e.stage}`} title={`${e.meaning} · stage: ${e.stage}`}>
              <span className="mono">{e.event}</span>
            </span>
          ))}
        </div>
        <div className="lc-legend">
          {STAGE_ORDER.map((s) => (
            <span key={s} className={`lc-legend-item lc-legend--${s}`}>
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ---------------- trigger rule walkthrough ---------------- */}
      <section className="section">
        <div className="section-title">Inspect a trigger rule</div>
        {!ruleFired ? (
          <button type="button" className="btn btn-primary btn-xs" style={{ alignSelf: 'flex-start' }} onClick={fire}>
            <Repeat size={11} aria-hidden /> Simulate: account created 72h ago, no card
          </button>
        ) : (
          <motion.div
            className="rule-chain"
            initial={motionAllowed ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rule-node rule-node--trigger">
              <b>Trigger</b>
              {TRIGGER_RULE.trigger}
            </div>
            <ArrowDown size={11} className="rule-arrow" aria-hidden />
            <div className="rule-node rule-node--ai">
              <b>AI interpretation</b>
              {TRIGGER_RULE.interpretation}
            </div>
            <ArrowDown size={11} className="rule-arrow" aria-hidden />
            <div className="rule-node">
              <b>Action</b>
              {TRIGGER_RULE.action}
            </div>
            <ArrowDown size={11} className="rule-arrow" aria-hidden />
            <div className="rule-node">
              <b>Channel</b>
              {TRIGGER_RULE.channel}
            </div>
            <ArrowDown size={11} className="rule-arrow" aria-hidden />
            <div className="rule-node">
              <b>Personalization</b>
              {TRIGGER_RULE.personalization}
            </div>
            <ArrowDown size={11} className="rule-arrow" aria-hidden />
            <div className="rule-node rule-node--success">
              <b>Success event</b>
              <span>
                <CheckCircle2 size={11} aria-hidden style={{ verticalAlign: -1.5, marginRight: 4 }} />
                {TRIGGER_RULE.success}
              </span>
              <span className="rule-guard">
                <Ban size={10} aria-hidden style={{ verticalAlign: -1.5, marginRight: 4 }} />
                {TRIGGER_RULE.guardrail}
              </span>
            </div>
          </motion.div>
        )}
      </section>

      {/* ---------------- SDR → AE handoff ---------------- */}
      <section className="section">
        <div className="section-title">SDR → AE handoff — a system, not a button</div>
        <p>The handoff travels this path automatically — routing to the right AE with CRM context attached:</p>
        <div className="handoff-flow">
          {HANDOFF_FLOW.map((s, i) => (
            <span key={s} className="handoff-node">
              {s}
              {i < HANDOFF_FLOW.length - 1 ? <span className="handoff-sep" aria-hidden>→</span> : null}
            </span>
          ))}
        </div>

        {handoffMode === null ? (
          <div className="handoff-toggle">
            <button type="button" className="btn btn-xs" onClick={() => setHandoffMode('bad')}>
              <ThumbsDown size={11} aria-hidden /> Show a bad handoff
            </button>
            <button type="button" className="btn btn-primary btn-xs" onClick={() => setHandoffMode('good')}>
              <ThumbsUp size={11} aria-hidden /> Show the handoff this engine builds
            </button>
          </div>
        ) : handoffMode === 'bad' ? (
          <motion.div className="handoff-card handoff-card--bad" initial={motionAllowed ? { opacity: 0 } : false} animate={{ opacity: 1 }}>
            <div className="handoff-card-head">
              <b>Bad handoff</b>
              <button type="button" className="btn btn-xs" onClick={() => setHandoffMode('good')}>
                Show the good one
              </button>
            </div>
            <p>{HANDOFF_BAD}</p>
          </motion.div>
        ) : (
          <motion.div className="handoff-card" initial={motionAllowed ? { opacity: 0 } : false} animate={{ opacity: 1 }}>
            <div className="handoff-card-head">
              <b>Handoff object — Acme México</b>
              <button type="button" className="btn btn-xs" onClick={() => setHandoffMode(null)}>
                Compare with bad
              </button>
            </div>
            <div className="handoff-rows">
              <HandRow label="Account" value={HANDOFF_GOOD.account} />
              <HandRow label="Contact" value={HANDOFF_GOOD.contact} />
              <HandRow label="Qualification" items={HANDOFF_GOOD.qualification} />
              <HandRow label="Conversation" items={HANDOFF_GOOD.conversation} />
              <HandRow label="Pain points" items={HANDOFF_GOOD.pains} />
              <HandRow label="Product interest" items={HANDOFF_GOOD.productInterest} />
              <HandRow label="Intent" items={HANDOFF_GOOD.intent} />
              <HandRow label="Talking points" items={HANDOFF_GOOD.talkingPoints} />
              <HandRow label="Source" value={HANDOFF_GOOD.source} />
              <HandRow label="AI research" value={HANDOFF_GOOD.research} />
              <HandRow label="CRM history" value={HANDOFF_GOOD.crmHistory} />
            </div>
          </motion.div>
        )}
      </section>
    </>
  );
}

function HandRow({ label, value, items }: { label: string; value?: string; items?: string[] }) {
  return (
    <div className="hand-row">
      <b>{label}</b>
      <div>
        {items ? (
          <ul>
            {items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
