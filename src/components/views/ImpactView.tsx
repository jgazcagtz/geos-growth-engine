import { Repeat2 } from 'lucide-react';
import { ATTRIBUTION_META, IMPACT_METRICS, LOOP_STAGES } from '../../data/impact';
import { EXPERIMENTS } from '../../data/experiments';
import type { Attribution } from '../../types';
import { ExperimentCard } from '../panel/ExperimentCard';
import { useEngine } from '../../state/EngineContext';

const ATTR_CLASS: Record<Attribution, string> = {
  attributed: 'attr--attributed',
  influenced: 'attr--influenced',
  correlated: 'attr--correlated',
};

const LOOP_KEY: Record<string, string> = {
  problem: 'lp.problem',
  hypothesis: 'lp.hypothesis',
  build: 'lp.build',
  ship: 'lp.ship',
  measure: 'lp.measure',
  learn: 'lp.learn',
  decide: 'lp.decide',
};

/** IMPACT view — is any of this actually creating value? Honest attribution. */
export function ImpactView() {
  const { t, metrics } = useEngine();

  const liveValue = (m: (typeof IMPACT_METRICS)[number]): string => {
    if (!m.liveKey) return m.value;
    return m.liveKey === 'activationRate'
      ? `${Math.round(metrics.activationRate * 100)}%`
      : `${metrics.ttv.toFixed(1)} days`;
  };

  return (
    <main className="impact-view" aria-label="Impact — measured business outcomes">
      <div className="view-head">
        <div>
          <h2>{t('imp.h2')}</h2>
          <p>{t('imp.sub')}</p>
        </div>
        <div className="attr-legend">
          {(Object.keys(ATTRIBUTION_META) as Attribution[]).map((a) => (
            <span key={a} className={`attr-chip ${ATTR_CLASS[a]}`} title={ATTRIBUTION_META[a].definition}>
              {t(`imp.attr${a.charAt(0).toUpperCase()}${a.slice(1)}`)}
            </span>
          ))}
          <span className="attr-legend-note">{t('imp.attrHover')}</span>
        </div>
      </div>

      <section className="section">
        <div className="section-title">{t('imp.role')}</div>
        <div className="impact-grid">
          {IMPACT_METRICS.map((m) => (
            <div key={m.key} className="impact-card">
              <div className="impact-card-top">
                <span className="impact-label">{m.label}</span>
                <span className={`attr-chip attr-chip--sm ${ATTR_CLASS[m.attribution]}`} title={ATTRIBUTION_META[m.attribution].definition}>
                  {t(`imp.attr${m.attribution.charAt(0).toUpperCase()}${m.attribution.slice(1)}`)}
                </span>
              </div>
              <div className="impact-val">
                {liveValue(m)}
                {m.liveKey ? <span className="impact-live-tag">live</span> : null}
              </div>
              <div className="impact-trend">{m.trend}</div>
              <div className="impact-note">{m.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <Repeat2 size={12} aria-hidden /> {t('imp.loop')}
        </div>
        <div className="loop-strip">
          {LOOP_STAGES.map((s, i) => (
            <div key={s.key} className="loop-stage">
              <span className="loop-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="loop-label">{t(LOOP_KEY[s.key] ?? s.label)}</span>
              <span className="loop-example">{s.example}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">{t('imp.expBoard')}</div>
        <p>{t('imp.expPara')}</p>
        <div className="impact-exps">
          {EXPERIMENTS.map((exp) => (
            <ExperimentCard key={exp.id} exp={exp} />
          ))}
        </div>
      </section>
    </main>
  );
}
