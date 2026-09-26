import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Eye, Pause, Play, RotateCcw, Square, StepForward } from 'lucide-react';
import { SCENARIO_MAP } from '../data/simulations';
import { useEngine } from '../state/EngineContext';

export function SimulationBar() {
  const {
    sim, simSpeed, setSimSpeed, pauseSim, resumeSim, stepSim, runScenario, stopSim, dismissSim, openInspect,
    motionAllowed, t,
  } = useEngine();
  const [glide, setGlide] = useState(0);
  const scenario = sim.scenarioId ? SCENARIO_MAP[sim.scenarioId] : null;

  /* the bar glides along the bottom toward whichever node is active */
  useEffect(() => {
    const live = sim.status === 'running' || sim.status === 'paused';
    if (!live || !sim.activeNode) {
      setGlide(0);
      return;
    }
    const t = window.setTimeout(() => {
      const region = document.querySelector('.canvas-region');
      const node =
        document.querySelector(`[data-nodeid="${sim.activeNode}"]`) ??
        document.querySelector('.node--active');
      if (!region || !node) return;
      const rr = region.getBoundingClientRect();
      const nr = node.getBoundingClientRect();
      const barW = Math.min(640, rr.width - 28);
      const maxShift = Math.max((rr.width - barW) / 2 - 10, 0);
      const raw = nr.left + nr.width / 2 - (rr.left + rr.width / 2);
      setGlide(Math.max(-maxShift, Math.min(maxShift, raw * 0.72)));
    }, 30);
    return () => window.clearTimeout(t);
  }, [sim.activeNode, sim.stepIndex, sim.status]);

  /* ESC exits the simulation — never trap the user */
  useEffect(() => {
    const live = sim.status === 'running' || sim.status === 'paused';
    if (!live) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stopSim();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sim.status, stopSim]);

  if (!scenario || sim.status === 'idle') return null;

  const running = sim.status === 'running';
  const paused = sim.status === 'paused';
  const live = running || paused;
  const step = scenario.steps[Math.min(sim.stepIndex, scenario.steps.length - 1)];
  const progress = ((live ? sim.stepIndex + 1 : scenario.steps.length) / scenario.steps.length) * 100;
  const canInspect = Boolean(step.inspect);

  return (
    <AnimatePresence>
      <motion.aside
        className="simbar"
        aria-label="Growth simulation"
        initial={motionAllowed ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        exit={motionAllowed ? { opacity: 0, y: 24 } : { opacity: 0 }}
        transition={motionAllowed ? { duration: 0.24 } : { duration: 0 }}
      >
        <div
          className="simbar-glide"
          style={{
            transform: `translateX(${glide}px)`,
            transition: motionAllowed ? 'transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)' : 'none',
          }}
        >
          <div className="simbar-head">
          <span className="simbar-eyebrow">
            {scenario.name} · {scenario.account}
          </span>
          {paused ? (
            <span className="simbar-title">
              {step.title} <span className="simbar-paused-chip">{t('sim.paused')}</span>
            </span>
          ) : running ? (
            <span className="simbar-title">{step.title}</span>
          ) : (
            <span className="simbar-title">{t('sim.loopClosed')}</span>
          )}
          <span className="simbar-step">
            {String(live ? sim.stepIndex + 1 : scenario.steps.length).padStart(2, '0')}/
            {String(scenario.steps.length).padStart(2, '0')}
          </span>
        </div>

        <div
          className="simbar-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={scenario.steps.length}
          aria-valuenow={live ? sim.stepIndex + 1 : scenario.steps.length}
        >
          <div className="simbar-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="simbar-detail">
          {live
            ? step.detail
            : `${scenario.account} ${t('sim.doneTail')}`}
        </div>

                <div className="simbar-log" aria-hidden>
          {sim.log.slice(-3).map((line) => (
            <div key={line.key}>
              {String(line.step).padStart(2, '0')} · {line.text}
            </div>
          ))}
        </div>

        <div className="simbar-actions">
          {live ? (
            <>
              <button
                type="button"
                className="btn btn-xs"
                onClick={() => setSimSpeed(simSpeed === 1 ? 1.5 : 1)}
                title="Playback speed"
              >
                {simSpeed}×
              </button>
              <button
                type="button"
                className="btn btn-xs"
                onClick={() => openInspect()}
                disabled={!canInspect}
                title={canInspect ? 'Inspect the raw event behind this step' : 'No raw payload captured for this step'}
              >
                <Eye size={10} aria-hidden /> {t('sim.inspect')}
              </button>
              {running ? (
                <>
                  <button
                    type="button"
                    className="btn btn-xs"
                    onClick={() => {
                      pauseSim();
                      stepSim();
                    }}
                    title="Advance one step, then hold"
                  >
                    <StepForward size={10} aria-hidden /> {t('sim.skip')}
                  </button>
                  <button type="button" className="btn btn-xs" onClick={pauseSim}>
                    <Pause size={10} aria-hidden /> {t('sim.pause')}
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn-xs" onClick={stepSim} title="Advance one step">
                    <StepForward size={10} aria-hidden /> {t('sim.step')}
                  </button>
                  <button type="button" className="btn btn-xs" onClick={resumeSim}>
                    <Play size={10} aria-hidden /> {t('sim.resume')}
                  </button>
                </>
              )}
              <button
                type="button"
                className="btn btn-xs"
                onClick={() => sim.scenarioId && runScenario(sim.scenarioId)}
                title="Restart from step 1"
              >
                <RotateCcw size={10} aria-hidden /> {t('sim.restart')}
              </button>
              <button type="button" className="btn btn-xs" onClick={stopSim}>
                <Square size={10} aria-hidden /> {t('sim.stop')}
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-primary btn-xs" onClick={dismissSim}>
              <CheckCircle2 size={11} aria-hidden /> {t('sim.done')}
            </button>
          )}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
