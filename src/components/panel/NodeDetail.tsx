import { ArrowRight, Briefcase, CheckCircle2, Cpu, SlidersHorizontal, Target, Wrench } from 'lucide-react';
import type { NodeId } from '../../types';
import { DETAILS } from '../../data/details';
import { EXEC_BRIEFS } from '../../data/details-exec';
import { useEngine } from '../../state/EngineContext';
import { AccountLab } from './AccountLab';
import { ReviewQueue } from './ReviewQueue';
import { ExperimentLab } from './ExperimentLab';
import { LifecycleLab } from './LifecycleLab';

export function NodeDetail({ id }: { id: NodeId }) {
  const detail = DETAILS[id];
  const { learnings, mode, lang, t } = useEngine();
  const exec = mode === 'executive' ? EXEC_BRIEFS[id] : null;

  return (
    <>
      <section className="section">
        <div className="wf-provenance">
          <span className="prov-badge prov-badge--proposed">PROPOSED architecture</span>
          <span className="prov-badge prov-badge--simulated">SIMULATED data</span>
        </div>
        <p style={{ color: 'var(--text)', fontSize: 13 }}>{detail.tagline}</p>
        <p>{detail.purpose}</p>
        {lang === 'es' ? <p className="fold-note">{t('nd.esNote')}</p> : null}
      </section>

      {exec ? (
        <section className="section">
          <div className="section-title">
            <Briefcase size={12} aria-hidden /> {t('nd.execBrief')}
          </div>
          <div className="exec-grid">
            <ExecCard k={t('nd.k.built')} text={exec.built} />
            <ExecCard k={t('nd.k.why')} text={exec.why} />
            <ExecCard k={t('nd.k.automates')} text={exec.automates} />
            <ExecCard k={t('nd.k.helps')} text={exec.helps} />
            <ExecCard k={t('nd.k.measure')} text={exec.measures} />
            <ExecCard k={t('nd.k.result')} text={exec.result} />
          </div>
        </section>
      ) : (
        <>
          {detail.inputs.length > 0 ? (
            <details className="fold">
              <summary>
                {t('nd.inputs')} <FoldCount n={detail.inputs.length} />
              </summary>
              <div className="fold-body">
                <div className="kv-list">
                  {detail.inputs.map((i) => (
                    <div key={i} className="kv-item">
                      {i}
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ) : null}

          {detail.deterministic || detail.ai ? (
            <section className="section">
              <div className="section-title">
                <SlidersHorizontal size={12} aria-hidden /> {t('nd.how')}
              </div>
              {detail.deterministic ? (
                <>
                  <div className="pill pill--det">
                    <Cpu size={11} aria-hidden style={{ marginRight: 6, verticalAlign: -1.5 }} />
                    {t('nd.det')}
                  </div>
                  <div className="kv-list" style={{ marginTop: 6 }}>
                    {detail.deterministic.map((d) => (
                      <div key={d} className="kv-item">
                        {d}
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
              {detail.ai ? (
                <>
                  <div className="pill pill--ai" style={{ marginTop: 10 }}>
                    {t('nd.ai')}
                  </div>
                  <div className="kv-list" style={{ marginTop: 6 }}>
                    {detail.ai.map((d) => (
                      <div key={d} className="kv-item">
                        {d}
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </section>
          ) : null}

          <details className="fold">
            <summary>
                {t('nd.outputs')} <FoldCount n={detail.outputs.length} />
            </summary>
            <div className="fold-body">
              <div className="kv-list">
                {detail.outputs.map((o) => (
                  <div key={o} className="kv-item">
                    {o}
                  </div>
                ))}
              </div>
            </div>
          </details>

          {detail.implementation ? (
            <details className="fold">
              <summary>
                <Wrench size={11} aria-hidden style={{ marginRight: 6, verticalAlign: -1.5 }} />
                {t('nd.impl')}
                <span className="prov-badge prov-badge--proposed" style={{ marginLeft: 'auto' }}>
                  proposed
                </span>
              </summary>
              <div className="fold-body">
                <div className="kv-list">
                  {detail.implementation.map((imp) => (
                    <div key={imp} className="kv-item">
                      {imp}
                    </div>
                  ))}
                </div>
                <p className="fold-note">{t('nd.implNote')}</p>
              </div>
            </details>
          ) : null}

          {detail.example ? (
            <section className="section">
              <div className="section-title">{t('nd.example')}</div>
              <div className="example-box">
                <div className="ex-row">
                  <b>Signal</b>
                  <span className="ex-body">{detail.example.signal}</span>
                </div>
                <div className="ex-row">
                  <b>Reasoning</b>
                  <span className="ex-body">{detail.example.reasoning}</span>
                </div>
                <div className="ex-row ex-row--action">
                  <b>Action</b>
                  <span className="ex-body">
                    <ArrowRight size={11} aria-hidden style={{ verticalAlign: -1.5, marginRight: 4 }} />
                    {detail.example.action}
                  </span>
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}

      <section className="section">
        <div className="kpi-box">
          <CheckCircle2 aria-hidden />
          <div>
            <div className="kpi-text">
              <Target size={10} aria-hidden style={{ verticalAlign: -1, marginRight: 4, opacity: 0.7 }} />
              KPI: {detail.kpi}
            </div>
            {detail.kpiNote ? <span className="kpi-note">{detail.kpiNote}</span> : null}
          </div>
        </div>
      </section>

      {id === 'orchestrator' && learnings.length > 0 ? (
        <section className="section">
          <div className="section-title">
            {t('nd.learnings')} <span className="count">{learnings.length} {t('nd.live')}</span>
          </div>
          {learnings.map((l) => (
            <div key={l.id} className="learning-chip">
              <div>
                {l.text}
                <span className="applies">applies to · {l.appliesTo}</span>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {id === 'account-graph' ? <AccountLab /> : null}
      {id === 'human' ? <ReviewQueue /> : null}
      {id === 'experiments' ? <ExperimentLab /> : null}
      {id === 'lifecycle' ? <LifecycleLab /> : null}
    </>
  );
}

function ExecCard({ k, text }: { k: string; text: string }) {
  return (
    <div className="exec-card">
      <div className="exec-k">{k}</div>
      <div className="exec-t">{text}</div>
    </div>
  );
}

function FoldCount({ n }: { n: number }) {
  return <span className="fold-count">{n}</span>;
}
