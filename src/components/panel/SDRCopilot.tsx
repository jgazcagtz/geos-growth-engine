import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  ClipboardList,
  Pencil,
  Radar,
  Search,
  SkipForward,
  UserCheck,
  X,
} from 'lucide-react';
import {
  COPILOT_CONTACTS,
  COPILOT_DRAFT,
  COPILOT_NBA_CHAIN,
  COPILOT_RESEARCH_MORE,
  COPILOT_SIGNALS,
  COPILOT_SUMMARY,
} from '../../data/gtm';
import { ACCOUNTS } from '../../data/accounts';
import { useEngine } from '../../state/EngineContext';

type CopilotState = 'draft' | 'released' | 'skipped';

/**
 * SDR Copilot — the AI removes research and admin work so the SDR spends
 * more time having conversations. Draft + evidence + meaningful controls.
 */
export function SDRCopilot() {
  const { motionAllowed, toast } = useEngine();
  const [state, setState] = useState<CopilotState>('draft');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(COPILOT_DRAFT.text);
  const [extra, setExtra] = useState<string[]>([]);
  const [assigned, setAssigned] = useState(false);

  const researchMore = () => {
    const next = COPILOT_RESEARCH_MORE[extra.length % COPILOT_RESEARCH_MORE.length];
    setExtra((prev) => (prev.includes(next) ? prev : [...prev, next]));
    toast('Deep research complete — enrichment added from external sources');
  };

  return (
    <section className="section">
      <div className="section-title">
        <Radar size={12} aria-hidden /> SDR Copilot — from brief to conversation
      </div>

      <div className="cop-block">
        <b>Buying committee</b>
        <div className="cop-contacts">
          {COPILOT_CONTACTS.map((c) => (
            <div key={c.name} className="cop-contact">
              <span className="cop-contact-name">{c.name}</span>
              <span className="cop-contact-role">
                {c.role} · {c.persona}
              </span>
              <span className="cop-contact-eng">{c.engagement}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cop-block">
        <b>Signal timeline</b>
        <div className="cop-signals">
          {COPILOT_SIGNALS.map((s) => (
            <div key={s.text} className="cop-signal">
              <span className="cop-signal-dot" aria-hidden />
              <span className="cop-signal-text">{s.text}</span>
              <span className="cop-signal-when">
                {s.source} · {s.when}
              </span>
            </div>
          ))}
          {extra.map((e) => (
            <div key={e} className="cop-signal cop-signal--extra">
              <span className="cop-signal-dot" aria-hidden />
              <span className="cop-signal-text">{e}</span>
              <span className="cop-signal-when">deep research · just now</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cop-block">
        <b>AI research summary</b>
        <p className="cop-summary">{COPILOT_SUMMARY}</p>
      </div>

      <div className="cop-block">
        <b>Next best action — in flight</b>
        <div className="nba-chain">
          {COPILOT_NBA_CHAIN.map((s) => (
            <div key={s.step} className={`nba-chain-step nba-chain-step--${s.state}`}>
              <span className="nba-chain-dot" aria-hidden />
              {s.step}
            </div>
          ))}
        </div>
      </div>

      <div className="cop-block">
        <b>Suggested angle</b>
        {ACCOUNTS.acme.firmographics.includes('Retail')
          ? 'Spend controls for a scaling finance team — ERP-connected cards, approvals, reconciliation.'
          : 'Spend controls for a scaling finance team.'}
      </div>

      <div className="cop-block">
        <b>Draft message</b>
        <span className="cop-draft-meta">
          {COPILOT_DRAFT.channel} · {COPILOT_DRAFT.localization} · confidence{' '}
          {(COPILOT_DRAFT.confidence * 100).toFixed(0)}%
        </span>
        {editing ? (
          <textarea
            className="cop-draft-edit"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={7}
            aria-label="Edit draft message"
          />
        ) : (
          <div className="cop-draft">{draft}</div>
        )}
        <div className="pill-wrap" style={{ marginTop: 7 }}>
          {COPILOT_DRAFT.provenance.map((p) => (
            <span key={p} className={`pill${p.startsWith('AI') ? ' pill--ai' : ''}`}>
              {p}
            </span>
          ))}
        </div>
      </div>

      {state === 'draft' ? (
        <div className="cop-actions">
          <button
            type="button"
            className="btn btn-primary btn-xs"
            onClick={() => {
              setState('released');
              setEditing(false);
              toast('Released — outreach sent, audit log updated, CRM task closed', 'success');
            }}
          >
            <Check size={11} aria-hidden /> Approve &amp; release
          </button>
          <button type="button" className="btn btn-xs" onClick={() => setEditing((e) => !e)}>
            <Pencil size={11} aria-hidden /> {editing ? 'Done editing' : 'Edit'}
          </button>
          <button type="button" className="btn btn-xs" onClick={researchMore}>
            <Search size={11} aria-hidden /> Research more
          </button>
          <button
            type="button"
            className="btn btn-xs"
            onClick={() => {
              if (assigned) return;
              setAssigned(true);
              toast('Assigned to SDR pool MX — task created with full context');
            }}
          >
            <UserCheck size={11} aria-hidden /> {assigned ? 'Assigned ✓' : 'Assign'}
          </button>
          <button
            type="button"
            className="btn btn-xs"
            onClick={() => {
              setState('skipped');
              toast('Skipped — recorded as model feedback for this segment');
            }}
          >
            <SkipForward size={11} aria-hidden /> Skip
          </button>
        </div>
      ) : (
        <div className={`cop-result${state === 'released' ? ' cop-result--ok' : ''}`}>
          {state === 'released' ? (
            <>
              <Check size={12} aria-hidden /> Outreach released — outcome now tracked to meeting booked and pipeline
              created.
            </>
          ) : (
            <>
              <X size={12} aria-hidden /> Skipped — the recommendation pattern is logged as negative feedback.
            </>
          )}
        </div>
      )}

      {state === 'draft' && !editing ? (
        <motion.p
          className="cop-note"
          initial={motionAllowed ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
        >
          The point is not AI-written email — it is that the SDR walks into a conversation already briefed.
          <ClipboardList size={11} aria-hidden style={{ marginLeft: 4, verticalAlign: -1.5 }} />
        </motion.p>
      ) : null}
    </section>
  );
}
