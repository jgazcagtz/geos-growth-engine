import { AlertTriangle, ArrowRight, CheckCircle2, CircleDollarSign, Clock, User } from 'lucide-react';
import type { EdgeId, WorkflowStep } from '../../types';
import { WORKFLOW_MAP } from '../../data/workflows';
import { useEngine } from '../../state/EngineContext';

const KIND_LABEL: Record<WorkflowStep['kind'], string> = {
  trigger: 'Trigger',
  filter: 'Filter',
  enrich: 'Enrich',
  ai: 'AI',
  decision: 'Decision',
  route: 'Route',
  action: 'Action',
  sync: 'Sync',
  measure: 'Measure',
};

export function WorkflowInspector({ edge }: { edge: EdgeId }) {
  const wf = WORKFLOW_MAP[edge];
  const { mode } = useEngine();

  return (
    <>
      <section className="section">
        <div className="wf-provenance">
          <span className="prov-badge prov-badge--proposed">PROPOSED architecture</span>
          <span className="prov-badge prov-badge--simulated">SIMULATED telemetry</span>
        </div>
        <p>{wf.purpose}</p>
        <div className="wf-trigger">
          <b>Trigger</b>
          {wf.trigger}
        </div>
      </section>

      <section className="section">
        <div className="section-title">Pipeline — {wf.steps.length} steps</div>
        <div className="wf-steps">
          {wf.steps.map((s, i) => (
            <div key={s.name} className="wf-step">
              <div className="wf-step-head">
                <span className="wf-step-num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{s.name}</strong>
                <span className={`wf-kind wf-kind--${s.kind}`}>{KIND_LABEL[s.kind]}</span>
                <span className={`wf-status wf-status--${s.status}`} title={s.error ?? 'healthy'}>
                  {s.status === 'healthy' ? (
                    <CheckCircle2 size={11} aria-hidden />
                  ) : (
                    <AlertTriangle size={11} aria-hidden />
                  )}
                </span>
              </div>
              <div className="wf-io">
                <div>
                  <b>in</b> {s.input}
                </div>
                <div>
                  <b>out</b> {s.output}
                </div>
              </div>
              <div className="wf-meta">
                <span>
                  <User size={9} aria-hidden /> {s.owner}
                </span>
                <span>
                  <Clock size={9} aria-hidden /> {s.latency}
                </span>
                <span>last run {s.lastRun}</span>
              </div>
              {s.error ? <div className="wf-error">{s.error}</div> : null}
              <div className="wf-purpose">{s.purpose}</div>
              {i < wf.steps.length - 1 ? (
                <ArrowRight size={11} className="wf-arrow" aria-hidden style={{ transform: 'rotate(90deg)' }} />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <CircleDollarSign size={12} aria-hidden /> Operational health — today
        </div>
        <div className="wf-health-grid">
          <div className="wf-health">
            <span className="wf-health-val">{wf.health.runsToday.toLocaleString('en-US')}</span>
            <span className="wf-health-k">runs</span>
          </div>
          <div className="wf-health">
            <span className="wf-health-val">{wf.health.successPct}%</span>
            <span className="wf-health-k">success</span>
          </div>
          <div className="wf-health">
            <span className="wf-health-val">{wf.health.escalations}</span>
            <span className="wf-health-k">escalated</span>
          </div>
          <div className="wf-health">
            <span className="wf-health-val">{wf.health.failures}</span>
            <span className="wf-health-k">failures</span>
          </div>
          <div className="wf-health">
            <span className="wf-health-val">{wf.health.medianRuntime}</span>
            <span className="wf-health-k">median</span>
          </div>
          <div className="wf-health">
            <span className="wf-health-val">{wf.health.llmCost}</span>
            <span className="wf-health-k">LLM cost</span>
          </div>
        </div>
        <div className="wf-influence">Pipeline influenced: {wf.health.pipelineInfluenced}</div>
      </section>

      {mode === 'builder' ? (
        <section className="section">
          <div className="section-title">Governance on this workflow</div>
          <div className="kv-list">
            <div className="kv-item">Idempotency keys on every send — retries never duplicate.</div>
            <div className="kv-item">Versioned prompt &amp; template IDs recorded with each AI step.</div>
            <div className="kv-item">RBAC-scoped owners; every failure visible in the ops feed.</div>
          </div>
        </section>
      ) : null}
    </>
  );
}
