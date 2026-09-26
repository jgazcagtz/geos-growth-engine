import { SCENARIO_MAP } from '../../data/simulations';
import { useEngine } from '../../state/EngineContext';

/** Raw event payload for a simulation step — the builder-mode inspector. */
export function InspectView() {
  const { inspectStep, sim, mode } = useEngine();
  const scenario = sim.scenarioId ? SCENARIO_MAP[sim.scenarioId] : null;
  const step = scenario && inspectStep !== null ? scenario.steps[Math.min(inspectStep, scenario.steps.length - 1)] : null;

  if (!step?.inspect) {
    return (
      <section className="section">
        <p>No raw payload captured for this step. Pause on a step with an Inspect button in the simulation bar.</p>
      </section>
    );
  }

  const { event, fields } = step.inspect;

  return (
    <>
      <section className="section">
        <p>{step.detail}</p>
      </section>
      <section className="section">
        <div className="section-title">Raw event</div>
        <div className="payload-box">
          <div className="payload-event mono">{event}</div>
          {fields.map(([k, v]) => (
            <div key={k} className="payload-row">
              <span className="payload-key mono">{k}</span>
              <span className="payload-val mono">{v}</span>
            </div>
          ))}
        </div>
      </section>
      {mode === 'builder' ? (
        <section className="section">
          <div className="kv-list">
            <div className="kv-item">Every AI step records its prompt &amp; model version — decisions stay auditable.</div>
            <div className="kv-item">Consent, suppression and frequency-cap checks happen at send time.</div>
            <div className="kv-item">Idempotency keys make retries safe by construction.</div>
          </div>
        </section>
      ) : null}
    </>
  );
}
