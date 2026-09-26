import { Gauge } from 'lucide-react';
import { METRICS, formatMetric } from '../../data/metrics';
import { useEngine } from '../../state/EngineContext';

export function MetricsHome() {
  const { metrics, focusMetricKey, focusMetric, recentDelta, t } = useEngine();

  return (
    <>
      <section className="section">
        <div className="section-title">
          <Gauge size={12} aria-hidden /> {t('mh.title')}
          <span className="prov-badge prov-badge--simulated" style={{ marginLeft: 4 }}>
            {t('mh.badge')}
          </span>
        </div>
        <p>{t('mh.para')}</p>
        <div className="metric-grid">
          {METRICS.map((m) => {
            const focused = focusMetricKey === m.key;
            return (
              <button
                key={m.key}
                type="button"
                className={`metric-card${focused ? ' metric-card--focus' : ''}`}
                onClick={() => focusMetric(m.key)}
                aria-pressed={focused}
              >
                <span className="metric-label">{t(`m.${m.key}`)}</span>
                <span className="metric-val">{formatMetric(m, metrics[m.key])}</span>
                {recentDelta && recentDelta.key === m.key ? (
                  <span className="metric-delta">{recentDelta.text}</span>
                ) : null}
                <span className="metric-contrib">{m.note}</span>
              </button>
            );
          })}
        </div>
        <p className="metric-icp-note">{t('mh.icp')}</p>
      </section>

      <section className="section">
        <div className="section-title">{t('mh.how')}</div>
        <div className="kv-list">
          <div className="kv-item">{t('mh.how1')}</div>
          <div className="kv-item">{t('mh.how2')}</div>
          <div className="kv-item">{t('mh.how3')}</div>
          <div className="kv-item">{t('mh.how4')}</div>
        </div>
      </section>
    </>
  );
}
