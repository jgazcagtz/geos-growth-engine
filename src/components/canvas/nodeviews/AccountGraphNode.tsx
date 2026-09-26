import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { SCORES, deriveStage } from '../../../data/account';
import { ACCOUNTS } from '../../../data/accounts';
import { useEngine } from '../../../state/EngineContext';

const ORBIT_CHIPS = [
  { label: 'People', x: 14, y: 6 },
  { label: 'Product', x: 128, y: 0 },
  { label: 'CRM', x: 148, y: 52 },
  { label: 'Spend', x: 104, y: 98 },
  { label: 'Engagement', x: 8, y: 96 },
  { label: 'Intent', x: 0, y: 46 },
];

const CENTER = { x: 92, y: 59 };

export function AccountGraphNode() {
  const { accountScores, activeAccount, sim, t } = useEngine();

  /* the graph narrates the ACTIVE scenario's account — one source of truth */
  const runLive = sim.status === 'running' || sim.status === 'paused';
  const fixture = activeAccount ? ACCOUNTS[activeAccount] : ACCOUNTS.vela;
  const scores = activeAccount ? fixture.base : accountScores;
  const stage = deriveStage(scores);

  return (
    <>
      <div className="node-head">
        <span className="node-head-icon">
          <Network size={13} aria-hidden />
        </span>
        <div>
          <div className="node-title">{t('n.graph')}</div>
          <div className="node-sub">{t('n.graph.s')}</div>
        </div>
        {runLive && activeAccount ? (
          <span className="node-tag node-tag--accent">scenario</span>
        ) : null}
      </div>

      <div className="node-body">
        <div className="company-chip">
          <strong>{fixture.name}</strong>
          <span>
            {fixture.domain} · {activeAccount ? fixture.segment : 'inspect fixture'}
          </span>
        </div>

        <div className="orbit-wrap">
          <svg width="184" height="118" viewBox="0 0 184 118" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
            {ORBIT_CHIPS.map((chip) => (
              <line
                key={chip.label}
                className="orbit-line"
                x1={CENTER.x}
                y1={CENTER.y}
                x2={chip.x + 26}
                y2={chip.y + 12}
              />
            ))}
            <circle className="orbit-center" cx={CENTER.x} cy={CENTER.y} r="4" />
          </svg>
          {ORBIT_CHIPS.map((chip) => (
            <span key={chip.label} className="orbit-node" style={{ left: chip.x, top: chip.y }}>
              {chip.label}
            </span>
          ))}
        </div>

        <div className="score-list">
          {SCORES.map((score) => (
            <div key={score.key} className="score-row" title={score.hint}>
              <span className="score-name">{score.label}</span>
              <span className="score-bar">
                <motion.span
                  className="score-fill"
                  style={{ display: 'block', width: `${scores[score.key]}%` }}
                  initial={false}
                  animate={{ width: `${scores[score.key]}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </span>
              <span className="score-val">{scores[score.key]}</span>
            </div>
          ))}
        </div>

        <span className="stage-badge">{stage}</span>
      </div>

      <div className="node-foot">identity resolution · AI enrichment · lifecycle classification — open to interact</div>
    </>
  );
}
