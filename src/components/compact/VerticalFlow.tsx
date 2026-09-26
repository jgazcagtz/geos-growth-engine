import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import {
  CircleDollarSign,
  Compass,
  Database,
  FlaskConical,
  GitBranch,
  Lock,
  Network,
  Play,
  Radar,
  Radio,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';
import { FLOW_ORDER } from '../../data/layouts';
import { DETAILS } from '../../data/details';
import { LANES } from '../../data/lifecycles';
import { useEngine } from '../../state/EngineContext';

const NODE_ICONS: Record<string, LucideIcon> = {
  'signals-1p': Database,
  'signals-ext': Radar,
  'account-graph': Network,
  orchestrator: Compass,
  lifecycle: GitBranch,
  channels: Radio,
  human: UserCheck,
  outcomes: CircleDollarSign,
  experiments: FlaskConical,
};

export function VerticalFlow() {
  const { select, runScenario, sim, motionAllowed } = useEngine();

  useEffect(() => {
    if (sim.status !== 'running' || !sim.activeNode) return;
    const el = document.querySelector(`[data-vnode="${sim.activeNode}"]`);
    el?.scrollIntoView({ block: 'center', behavior: motionAllowed ? 'smooth' : 'auto' });
  }, [sim.stepIndex, sim.status, sim.activeNode, motionAllowed]);

  return (
    <div className="vflow">
      <p className="vflow-intro">
        The Growth Engine, top to bottom: signals become account intelligence, decisions become actions, outcomes
        become learnings — and the loop closes. Tap any stage for its internals, or run a simulation from the header.
      </p>

      {FLOW_ORDER.map((id, i: number) => {
        const Icon = NODE_ICONS[id];
        const detail = DETAILS[id];
        const active = sim.status === 'running' && sim.activeNode === id;
        return (
          <div key={id} className="vflow-item" data-vnode={id}>
            <div className="vflow-rail">
              <span className={`vflow-dot${active || id === 'orchestrator' ? ' vflow-dot--accent' : ''}`}>
                <Icon size={14} aria-hidden />
              </span>
              {i < FLOW_ORDER.length - 1 ? <span className="vflow-line" aria-hidden /> : null}
            </div>

            {/* div-button so the lane buttons inside are never nested <button>s */}
            <div
              role="button"
              tabIndex={0}
              className="vflow-card"
              onClick={() => select(id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  select(id);
                }
              }}
            >
              <strong>
                {detail.id === 'orchestrator' ? 'AI Growth Orchestrator' : titleFor(id)}
              </strong>
              <span>{detail.tagline}</span>

              {id === 'lifecycle' ? (
                <div className="vflow-lanes" role="group" aria-label="Lifecycle scenarios">
                  {LANES.map((lane) => (
                    <button
                      key={lane.id}
                      type="button"
                      className="lane-btn"
                      style={{ '--lane-c': lane.color } as CSSProperties}
                      onClick={() => runScenario(lane.scenario)}
                    >
                      <span className="lane-name">{lane.name}</span>
                      <span className="lane-flow">{lane.flow}</span>
                      <span className="lane-run">
                        <Play size={8} aria-hidden style={{ verticalAlign: -1, marginRight: 3 }} />
                        run
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}

      <div className="vflow-item" data-vnode="governance">
        <div className="vflow-rail">
          <span className="vflow-dot vflow-dot--accent">
            <Lock size={14} aria-hidden />
          </span>
        </div>
        <button type="button" className="vflow-gov" onClick={() => select('governance')}>
          <strong style={{ fontSize: 13.5 }}>Governance — under every layer</strong>
          <div className="gov-chip-cloud">
            {[
              'RBAC',
              'Audit logs',
              'Consent',
              'PII protection',
              'Data privacy',
              'Approval gates',
              'Frequency caps',
              'Suppression',
              'Model monitoring',
              'Human review',
            ].map((c) => (
              <span key={c} className="gov-chip">
                {c}
              </span>
            ))}
          </div>
        </button>
      </div>
    </div>
  );
}

function titleFor(id: string): string {
  const titles: Record<string, string> = {
    'signals-1p': 'First-party signals',
    'signals-ext': 'External signals',
    'account-graph': 'Account Graph',
    lifecycle: 'Growth lifecycle — four lanes',
    channels: 'Channel orchestration',
    human: 'Human-in-the-loop',
    outcomes: 'Pipeline · adoption · revenue',
    experiments: 'Experimentation & measurement',
  };
  return titles[id] ?? id;
}
