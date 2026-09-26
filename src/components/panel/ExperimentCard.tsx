import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ban, Play, Sparkles } from 'lucide-react';
import type { Experiment } from '../../types';
import { useEngine } from '../../state/EngineContext';

const STAGES = ['Hypothesis', 'Audience', 'Variants', 'Execution', 'Conversion', 'Result'] as const;

export function ExperimentCard({ exp }: { exp: Experiment }) {
  const { motionAllowed, learnings, addLearning } = useEngine();
  const [stage, setStage] = useState<number>(
    exp.status === 'shipped' || exp.status === 'killed' ? STAGES.length : -1,
  );
  const shippedToOrchestrator = learnings.some((l) => l.id === exp.id);
  const done = stage >= STAGES.length;
  const canPlay = exp.status === 'running' || exp.status === 'shipped' || exp.status === 'killed';

  useEffect(() => {
    if (stage < 0 || stage >= STAGES.length) return;
    const t = window.setTimeout(() => setStage((s) => s + 1), motionAllowed ? 480 : 30);
    return () => window.clearTimeout(t);
  }, [stage, motionAllowed]);

  const { result } = exp;
  const max = Math.max(result.a, result.b, 0.001);
  const isKilled = exp.status === 'killed';

  return (
    <div className={`exp-card${isKilled ? ' exp-card--killed' : ''}`}>
      <div className="exp-card-head">
        <strong>{exp.name}</strong>
        <span className={`exp-badge exp-badge--${exp.status}`}>{exp.status}</span>
      </div>

      <p>
        <b>Hypothesis</b>
        {exp.hypothesis}
      </p>
      <p>
        <b>Audience</b>
        {exp.audience}
      </p>

      <div className="exp-meta" style={{ marginBottom: 4 }}>
        <span>{exp.result.metricLabel}</span>
        <span>n = {result.sample.toLocaleString('en-US')}</span>
        <span>{result.pValue}</span>
      </div>

      {stage < 0 ? (
        <button
          type="button"
          className="btn btn-xs"
          style={{ alignSelf: 'flex-start' }}
          disabled={!canPlay}
          onClick={() => setStage(0)}
        >
          <Play size={10} aria-hidden />
          {exp.status === 'draft'
            ? 'Draft — awaiting sign-off'
            : exp.status === 'running'
              ? 'Play interim analysis'
              : 'Replay readout'}
        </button>
      ) : (
        <>
          <div className="stage-track" aria-label="Experiment stages">
            {STAGES.map((s, i) => (
              <span key={s} className={`stage-dot${i < stage ? ' stage-dot--done' : ''}`} title={s} />
            ))}
          </div>

          {done ? (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="variant-bars">
                <div className="variant-row">
                  <span>{result.variantA}</span>
                  <span className="variant-bar">
                    <motion.span
                      className="variant-fill"
                      style={{ display: 'block' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(result.a / max) * 100}%` }}
                      transition={{ duration: motionAllowed ? 0.6 : 0 }}
                    />
                  </span>
                  <span className="variant-num">
                    {result.a}
                    {result.unit}
                  </span>
                </div>
                <div className="variant-row">
                  <span>{result.variantB}</span>
                  <span className="variant-bar">
                    <motion.span
                      className={`variant-fill${result.winner === 'B' && !isKilled ? ' variant-fill--win' : ''}`}
                      style={{ display: 'block' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(result.b / max) * 100}%` }}
                      transition={{ duration: motionAllowed ? 0.6 : 0 }}
                    />
                  </span>
                  <span className="variant-num">
                    {result.b}
                    {result.unit}
                  </span>
                </div>
              </div>

              {isKilled ? (
                <div className="kill-chip" style={{ marginTop: 8 }}>
                  <Ban size={12} aria-hidden />
                  <div>
                    <b>Decision: kill experiment</b>
                    {exp.learning}
                  </div>
                </div>
              ) : (
                <>
                  <div className="learning-chip" style={{ marginTop: 8 }}>
                    <div>
                      {exp.learning}
                      <span className="applies">applies to · {exp.appliesTo}</span>
                    </div>
                  </div>

                  {shippedToOrchestrator ? (
                    <p style={{ marginTop: 8, color: 'var(--good)', fontSize: 11.5 }}>
                      ✓ Learning live in the Orchestrator — channel &amp; timing weights updated.
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      style={{ alignSelf: 'flex-start', marginTop: 8 }}
                      onClick={() => addLearning({ id: exp.id, text: exp.learning, appliesTo: exp.appliesTo })}
                    >
                      <Sparkles size={11} aria-hidden /> Ship learning to the Orchestrator
                    </button>
                  )}
                </>
              )}

              {exp.status === 'shipped' || isKilled ? (
                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={() => setStage(0)}
                >
                  <Play size={10} aria-hidden /> Replay readout
                </button>
              ) : null}
            </motion.div>
          ) : null}
        </>
      )}
    </div>
  );
}
