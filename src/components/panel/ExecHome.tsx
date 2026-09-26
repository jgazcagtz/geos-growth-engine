import { useEngine } from '../../state/EngineContext';

/** Executive narrative: seven beats, readable in under a minute. */
const STORY: { n: string; k: string; text: string }[] = [
  { n: '01', k: 'ex.s1', text: 'A growth team cannot manually watch 40,000 accounts. Buying windows open and close unnoticed.' },
  { n: '02', k: 'ex.s2', text: 'Signals become account intelligence — one living record per company.' },
  { n: '03', k: 'ex.s3', text: 'Rules and AI decide who matters, why now, what to do, which channel.' },
  { n: '04', k: 'ex.s4', text: 'Automation does the repetitive work: research, drafting, nudges, routing, reporting.' },
  { n: '05', k: 'ex.s5', text: 'People keep judgment: SDRs approve outreach, AEs take meetings, CS handles risk.' },
  { n: '06', k: 'ex.s6', text: 'Meetings, activation and pipeline are measured against holdouts.' },
  { n: '07', k: 'ex.s7', text: 'Results return as learnings — winners scale, losers get killed with a written reason.' },
];

export function ExecHome() {
  const { setView, t } = useEngine();

  return (
    <>
      <section className="section">
        <div className="section-title">{t('ex.objectiveTitle')}</div>
        <p className="exec-objective">{t('ex.objective')}</p>
      </section>

      <section className="section">
        <div className="section-title">{t('ex.how')}</div>
        <div className="exec-seq">
          {STORY.map((s) => (
            <div key={s.n} className="exec-step">
              <span className="exec-n mono">{s.n}</span>
              <div className="exec-step-body">
                <div className="exec-k">{t(s.k)}</div>
                <div className="exec-t">{s.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">{t('ex.market')}</div>
        <div className="exec-grid">
          <div className="exec-card">
            <div className="exec-k">{t('ex.k.wedge')}</div>
            <div className="exec-t">
              LatAm mid-market (100–1,000 FTE) finance teams in MX · BR · CO — corporate card and spend-software
              penetration is still single-digit.
            </div>
          </div>
          <div className="exec-card">
            <div className="exec-k">{t('ex.k.pool')}</div>
            <div className="exec-t">
              Regional B2B payments run through manual transfers and invoices — hundreds of billions of dollars in
              annual volume, digitizing fast (public market reporting).
            </div>
          </div>
          <div className="exec-card">
            <div className="exec-k">{t('ex.k.buyers')}</div>
            <div className="exec-t">
              CFO (economic buyer) → Finance Director (champion) → Procurement / AP (evaluator) → Operations admin
              (implementer). The workflows map to exactly this committee.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">{t('ex.produced')}</div>
        <div className="exec-grid">
          <div className="exec-card">
            <div className="exec-k">{t('ex.k.pipeline')}</div>
            <div className="exec-t">$1.84M attributed QTD against a 5% holdout.</div>
          </div>
          <div className="exec-card">
            <div className="exec-k">{t('ex.k.speed')}</div>
            <div className="exec-t">Signal → first contact down to 26 minutes.</div>
          </div>
          <div className="exec-card">
            <div className="exec-k">{t('ex.k.learning')}</div>
            <div className="exec-t">+34% reply lift on the winning channel test — now default for the segment.</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">{t('ex.look')}</div>
        <div className="exec-links">
          <button type="button" className="btn btn-xs" onClick={() => setView('ops')}>
            {t('ex.lookOps')}
          </button>
          <button type="button" className="btn btn-xs" onClick={() => setView('impact')}>
            {t('ex.lookImp')}
          </button>
        </div>
      </section>

      <section className="section">
        <div className="wf-provenance">
          <span className="prov-badge prov-badge--proposed">PROPOSED architecture</span>
          <span className="prov-badge prov-badge--simulated">SIMULATED data</span>
          <span className="prov-badge prov-badge--known">KNOWN · public market data</span>
        </div>
        <p>{t('ex.provNote')}</p>
      </section>
    </>
  );
}
