import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { LANES } from '../../../data/lifecycles';
import { CHANNELS } from '../../../data/channels';
import { REVIEWS } from '../../../data/reviews';
import { SCENARIO_REVIEW } from '../../../data/accounts';
import { METRIC_MAP, formatMetric } from '../../../data/metrics';
import { SCENARIO_MAP } from '../../../data/simulations';
import { useEngine } from '../../../state/EngineContext';

const LANE_ICONS: Record<string, LucideIcon> = {
  acquire: UserPlus,
  activate: Zap,
  retain: ShieldCheck,
  expand: TrendingUp,
};

/* ------------------------------ lifecycle ------------------------------ */

export function LifecycleNode() {
  const { sim, runScenario, t } = useEngine();
  const activeLane = sim.status !== 'idle' && sim.scenarioId ? SCENARIO_MAP[sim.scenarioId]?.lane : null;

  return (
    <>
      <div className="node-head">
        <div>
          <div className="node-title">{t('n.lifecycle')}</div>
          <div className="node-sub">{t('n.lifecycle.s')}</div>
        </div>
      </div>
      <div className="node-body">
        <div className="lane-grid">
          {LANES.map((lane) => {
            const Icon = LANE_ICONS[lane.id];
            const hot = activeLane === lane.id;
            return (
              <button
                key={lane.id}
                type="button"
                className={`lane-btn${hot ? ' lane-btn--hot' : ''}`}
                style={{ '--lane-c': lane.color } as CSSProperties}
                data-tip={t(`lane.${lane.id}.tip`)}
                onClick={(e) => {
                  e.stopPropagation();
                  runScenario(lane.scenario);
                }}
                aria-label={`Run the ${lane.name} scenario`}
              >
                <span className="lane-name">
                  <Icon aria-hidden />
                  {t(`lane.${lane.id}`)}
                </span>
                <span className="lane-flow">{lane.flow}</span>
                <span className="lane-run">run →</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ------------------------------ channels ------------------------------ */

export function ChannelsNode() {
  const { sim, t } = useEngine();
  const currentChannel =
    sim.status === 'running' && sim.scenarioId
      ? SCENARIO_MAP[sim.scenarioId]?.steps[sim.stepIndex]?.channel
      : undefined;

  return (
    <>
      <div className="node-head">
        <div>
          <div className="node-title">{t('n.channels')}</div>
          <div className="node-sub">{t('n.channels.s')}</div>
        </div>
      </div>
      <div className="node-body">
        <div className="chan-grid">
          {CHANNELS.map((ch) => (
            <span
              key={ch.id}
              className={`chan-chip${currentChannel === ch.id ? ' chan-chip--hot' : ''}`}
              data-stage={ch.stage ?? 'mvp'}
              title={ch.note}
            >
              {ch.label}
            </span>
          ))}
        </div>
        <div className="chan-note">selected per action by context, preferences & learned results</div>
      </div>
    </>
  );
}

/* --------------------------- human-in-the-loop --------------------------- */

export function HumanNode() {
  const { reviewStatus, setReviewStatus, t, sim } = useEngine();
  /* the card narrates the active scenario's queue item, not a hardcoded one */
  const mapped = sim.scenarioId ? SCENARIO_REVIEW[sim.scenarioId] : undefined;
  const review = REVIEWS.find((r) => r.id === mapped) ?? REVIEWS[0];
  const status = reviewStatus[review.id];

  return (
    <>
      <div className="node-head">
        <div>
          <div className="node-title">{t('n.human')}</div>
          <div className="node-sub">{t('n.human.s')}</div>
        </div>
        <span className="node-tag node-tag--accent">gated</span>
      </div>
      <div className="node-body">
        <div className="review-mini">
          <div className="review-mini-top">
            <strong>{review.account}</strong>
            <span className="conf">{review.confidence}</span>
          </div>
          <div className="review-mini-rows">
            <div>
              <b>signal</b> {review.signal}
            </div>
            <div>
              <b>why now</b> {review.whyNow[0]} · {review.whyNow[2]}
            </div>
            <div>
              <b>nba</b> {review.recommended.split(':')[0]}
            </div>
          </div>
          {status === 'pending' ? (
            <div className="review-mini-actions" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="btn btn-primary btn-xs" onClick={() => setReviewStatus(review.id, 'approved')}>
                Approve
              </button>
              <button type="button" className="btn btn-xs" onClick={() => setReviewStatus(review.id, 'modified')}>
                Modify
              </button>
              <button
                type="button"
                className="btn btn-xs"
                aria-label="Dismiss recommendation"
                title="Dismiss recommendation"
                onClick={() => setReviewStatus(review.id, 'dismissed')}
              >
                <X size={11} aria-hidden />
              </button>
            </div>
          ) : (
            <span
              className={`status-badge status-badge--${status}`}
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
            >
              <Check size={10} aria-hidden /> {status}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

/* ------------------------------ outcomes ------------------------------ */

export function OutcomesNode() {
  const { metrics, recentDelta, t } = useEngine();

  const stats = [
    { key: 'pipeline' as const, label: 'Pipeline' },
    { key: 'activationRate' as const, label: 'Activation' },
    { key: 'revenue' as const, label: 'Rev. infl.' },
  ];

  return (
    <>
      <div className="node-head">
        <div>
          <div className="node-title">{t('n.outcomes')}</div>
          <div className="node-sub">{t('n.outcomes.s')}</div>
        </div>
      </div>
      <div className="node-body">
        <div className="stat-row">
          {stats.map((s) => {
            const metric = METRIC_MAP[s.key];
            return (
              <div key={s.key} className="stat">
                <span className="stat-val">{formatMetric(metric, metrics[s.key])}</span>
                <span className="stat-label">{s.label}</span>
                {recentDelta && recentDelta.key === s.key ? <span className="stat-delta">{recentDelta.text}</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ------------------------------ experiments ------------------------------ */

function LoopViz({ pulse, motionAllowed }: { pulse: number; motionAllowed: boolean }) {
  return (
    <svg className="loop-svg" width="76" height="44" viewBox="0 0 76 44" aria-hidden="true">
      <circle className="loop-track" cx="38" cy="22" r="16" />
      <g className={motionAllowed ? 'loop-orbit' : undefined} key={pulse}>
        <circle className="loop-comet" cx="54" cy="22" r="3" />
        <circle className="loop-comet loop-comet--trail" cx="46.5" cy="22" r="2" />
      </g>
      <circle className="loop-station" cx="38" cy="6" r="2.6" />
      <circle className="loop-station" cx="24.1" cy="30" r="2.6" />
      <circle className="loop-station" cx="51.9" cy="30" r="2.6" />
    </svg>
  );
}

export function ExperimentsNode() {
  const { metrics, learnings, feedbackPulse, motionAllowed, t } = useEngine();

  return (
    <>
      <div className="node-head">
        <div>
          <div className="node-title">{t('n.experiments')}</div>
          <div className="node-sub">{t('n.experiments.s')}</div>
        </div>
      </div>
      <div className="node-body">
        <div className="exp-live">
          <div className="exp-stat">
            <strong>{metrics.experimentsRunning}</strong>
            <span>running</span>
          </div>

          <LoopViz pulse={feedbackPulse} motionAllowed={motionAllowed} />

          <div className="exp-stat">
            <motion.strong
              key={learnings.length}
              initial={motionAllowed && learnings.length > 0 ? { scale: 1.55, color: 'var(--accent-strong)' } : false}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 16 }}
              style={{ display: 'block' }}
            >
              {learnings.length}
            </motion.strong>
            <span>learnings</span>
          </div>
        </div>
      </div>
    </>
  );
}
