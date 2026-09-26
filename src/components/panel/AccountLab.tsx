import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import type { ScoreKey } from '../../types';
import {
  GRAPH_ENRICHMENT,
  GRAPH_RELATIONSHIPS,
  SCORES,
  deriveAction,
  deriveStage,
} from '../../data/account';
import { ACCOUNTS, LAB_ACCOUNTS, LAB_EVENTS } from '../../data/accounts';
import { useEngine } from '../../state/EngineContext';
import { SDRCopilot } from './SDRCopilot';

const SCORE_COLORS: Record<ScoreKey, string> = {
  icp: 'var(--accent)',
  intent: 'var(--lane-acquire)',
  engagement: '#9aa1b0',
  activation: 'var(--lane-activate)',
  expansion: 'var(--lane-expand)',
  risk: 'var(--risk)',
};

export function AccountLab() {
  const { accountScores, applyAccountEvent, resetAccount, labAccount, setLabAccount } = useEngine();
  const [lastInsight, setLastInsight] = useState<string | null>(null);

  const fixture = ACCOUNTS[labAccount] ?? ACCOUNTS.vela;
  const events = LAB_EVENTS[(labAccount as 'vela' | 'mediterra') ?? 'vela'] ?? LAB_EVENTS.vela;

  const fill = (tpl: string) => tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(accountScores[k as ScoreKey] ?? ''));
  const stage = deriveStage(accountScores);
  const action = deriveAction(accountScores);

  return (
    <>
      <section className="section">
        <div className="section-title">Account lab — interact with a company</div>
        <div className="lab-switch" role="group" aria-label="Fixture account">
          {LAB_ACCOUNTS.map((id) => (
            <button
              key={id}
              type="button"
              className={`lab-switch-btn${labAccount === id ? ' lab-switch-btn--on' : ''}`}
              aria-pressed={labAccount === id}
              onClick={() => {
                setLabAccount(id);
                resetAccount();
                setLastInsight(null);
              }}
            >
              {ACCOUNTS[id].name}
              <span className="lab-switch-kind">{ACCOUNTS[id].kind === 'saas' ? 'non-fintech' : 'fintech'}</span>
            </button>
          ))}
        </div>
        <p className="lab-note">
          Same engine, different category — the SaaS fixture swaps card milestones for trial milestones without any UI
          rewrite. All data simulated.
        </p>
        <div className="acct-head">
          <span className="acct-ident">{fixture.name.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{fixture.name}</strong>
            <span>
              {fixture.firmographics} · {fixture.domain}
            </span>
          </div>
        </div>
        <div className="pill-wrap">
          {GRAPH_ENRICHMENT.map((e) => (
            <span key={e} className="pill">
              {e}
            </span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">Relationships in the graph</div>
        <div className="pill-wrap">
          {GRAPH_RELATIONSHIPS.map((r) => (
            <span key={r.label} className="chip">
              {r.label} · {r.value}
            </span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">Live scores</div>
        {SCORES.map((s) => (
          <div key={s.key} className="lab-score" title={s.hint}>
            <span className="lab-score-name">{s.label}</span>
            <span className="lab-score-bar">
              <motion.span
                className="lab-score-fill"
                style={{ display: 'block', background: SCORE_COLORS[s.key] }}
                initial={false}
                animate={{ width: `${accountScores[s.key]}%` }}
                transition={{ type: 'spring', stiffness: 130, damping: 22 }}
              />
            </span>
            <span className="lab-score-val">{accountScores[s.key]}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-title">Fire a signal at this account</div>
        <div className="event-btns">
          {events.map((ev) => (
            <button
              key={ev.id}
              type="button"
              className="event-btn"
              onClick={() => {
                applyAccountEvent(ev);
                setLastInsight(ev.insight);
              }}
            >
              <span className="ev-src">{ev.source}</span>
              <span className="ev-label">{ev.label}</span>
              <ChevronRight size={13} className="ev-go" aria-hidden />
            </button>
          ))}
        </div>
        {lastInsight ? <p style={{ marginTop: 6 }}>{lastInsight}</p> : null}
        <button type="button" className="btn btn-xs" style={{ alignSelf: 'flex-start' }} onClick={() => { resetAccount(); setLastInsight(null); }}>
          <RotateCcw size={11} aria-hidden /> Reset account
        </button>
      </section>

      <section className="section">
        <div className="section-title">What the engine concludes</div>
        <span className="stage-chip">
          <span className="dot" aria-hidden /> {stage}
        </span>
        <div className="nba-box">
          <span className="nba-k">Next best action</span>
          <span className="nba-headline">{action.headline}</span>
          <span className="nba-why">{fill(action.why)}</span>
          <span className="nba-chan">
            <Sparkles size={10} aria-hidden style={{ verticalAlign: -1, marginRight: 3 }} />
            channel: {action.channel}
          </span>
        </div>
      </section>

      <SDRCopilot />
    </>
  );
}
