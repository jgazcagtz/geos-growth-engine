import { Gauge, Lock } from 'lucide-react';
import { ArchitectureCanvas } from '../canvas/ArchitectureCanvas';
import { SimulationBar } from '../SimulationBar';
import { useEngine } from '../../state/EngineContext';
import { LAYOUTS } from '../../data/layouts';
import type { ViewStage } from '../../types';

const STAGES: { id: ViewStage; key: string; tipKey: string }[] = [
  { id: 'mvp', key: 'stage.mvp', tipKey: 'stage.tipMvp' },
  { id: 'scale', key: 'stage.scale', tipKey: 'stage.tipScale' },
  { id: 'vision', key: 'stage.vision', tipKey: 'stage.tipVision' },
];

const HINT_KEY: Record<ViewStage, string> = {
  mvp: 'stage.hintMvp',
  scale: 'stage.hintScale',
  vision: 'stage.hintVision',
};

/** SYSTEM view — the living architecture canvas. */
export function SystemView() {
  const { sim, stage, setStage, layout, setLayout, openHome, t } = useEngine();

  return (
    <main
      className={`canvas-region${sim.status !== 'idle' ? ' sim-open' : ''}`}
      aria-label="Growth engine architecture"
    >
      <div className="legend-bar">
        <div className="stage-seg" role="group" aria-label="Build progression">
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`stage-btn${stage === s.id ? ' stage-btn--on' : ''}`}
              aria-pressed={stage === s.id}
              title={t(s.tipKey)}
              onClick={() => setStage(s.id)}
            >
              {t(s.key)}
            </button>
          ))}
        </div>

        <div className="stage-seg" role="group" aria-label={t('lg.layout')}>
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`stage-btn stage-btn--lay${layout === l.id ? ' stage-btn--on' : ''}`}
              aria-pressed={layout === l.id}
              title={`${t('lg.layout')}: ${t(`lay.${l.id}`)}`}
              onClick={() => setLayout(l.id)}
            >
              {t(`lay.${l.id}`)}
            </button>
          ))}
        </div>

        <span className="legend-hint">{t(HINT_KEY[stage])}</span>
        <span className="legend-key">
          <span className="lg-dot" aria-hidden /> {t('lg.packets')}
        </span>
        <span className="legend-key">
          <span className="lg-loop" aria-hidden /> {t('lg.loop')}
        </span>
        <span className="legend-key">
          <Lock size={11} className="lg-lock" aria-hidden /> {t('lg.gov')}
        </span>
        <button type="button" className="btn btn-xs legend-cmd" onClick={openHome} title={t('lg.cmdCenter')}>
          <Gauge size={11} aria-hidden /> {t('lg.cmdCenter')}
        </button>
        <span className="spacer">{t('lg.blueprint')}</span>
      </div>
      <ArchitectureCanvas />
      <SimulationBar />
    </main>
  );
}
