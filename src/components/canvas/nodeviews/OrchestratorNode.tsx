import type { CSSProperties } from 'react';
import { Compass } from 'lucide-react';
import { useEngine } from '../../../state/EngineContext';

const QUESTIONS: { k: string; head: string; sub: string; full: string }[] = [
  { k: 'WHO', head: 'accounts that matter', sub: 'ICP fit · intent · stage', full: 'Which account deserves attention right now?' },
  { k: 'WHY', head: 'timing triggers', sub: 'funding · pricing visits · usage shift', full: 'Why does it matter now?' },
  { k: 'WHAT', head: 'next best action', sub: 'playbook step + message context', full: 'What is the next best action?' },
  { k: 'WHICH', head: 'channel & owner', sub: 'email · WhatsApp · tasks', full: 'Which channel and owner should execute it?' },
];

const DETERMINISTIC = ['Business rules', 'Thresholds & gates', 'Routing', 'Frequency caps', 'Suppression', 'Compliance'];

const AI_REASONING = ['Account research', 'Classification', 'Summarization', 'Prioritization', 'Personalization', 'Recommendations'];

const CAPABILITIES = [
  'Research',
  'ICP scoring',
  'Signals',
  'Lifecycle',
  'Next action',
  'Personalize',
  'Activation',
  'Expansion',
  'Risk',
  'Experiments',
];

export function OrchestratorNode() {
  const { learnings, sim, t } = useEngine();
  const processing = sim.status === 'running' && sim.activeNode === 'orchestrator';

  return (
    <>
      <div className="node-head">
        <span className="node-head-icon">
          <Compass size={13} aria-hidden />
        </span>
        <div>
          <div className="node-title">{t('n.orch')}</div>
          <div className="node-sub">{t('n.orch.s')}</div>
        </div>
        {learnings.length > 0 ? (
          <span className="node-tag node-tag--accent">{learnings.length} learnings</span>
        ) : (
          <span className="node-tag">core</span>
        )}
      </div>

      <div className="node-body">
        <div className={`q-grid${processing ? ' q-grid--processing' : ''}`}>
          {QUESTIONS.map((q, i) => (
            <div key={q.k} className="q-row" style={{ '--i': i } as CSSProperties} title={q.full}>
              <span className="q-key">{q.k}</span>
              <span className="q-val">
                <strong>{q.head}</strong>
                <br />
                {q.sub}
              </span>
            </div>
          ))}
        </div>

        <div className={`split${processing ? ' split--processing' : ''}`}>
          <div className="split-col split-col--det">
            <h4>Deterministic</h4>
            <ul>
              {DETERMINISTIC.map((d, i) => (
                <li key={d} style={{ '--j': i } as CSSProperties}>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="split-col split-col--ai">
            <h4>AI reasoning</h4>
            <ul>
              {AI_REASONING.map((d, i) => (
                <li key={d} style={{ '--j': i } as CSSProperties}>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="cap-grid">
          {CAPABILITIES.map((cap) => (
            <span key={cap} className="cap-chip">
              {cap}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
