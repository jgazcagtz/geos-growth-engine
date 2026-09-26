import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Play, RotateCcw, Sun, Zap, ZapOff } from 'lucide-react';
import { SCENARIOS, SCENARIO_GROUPS } from '../data/simulations';
import { LANE_MAP } from '../data/lifecycles';
import { useEngine } from '../state/EngineContext';
import type { ViewId } from '../types';
import type { ScenarioId } from '../types';

const VIEWS: { id: ViewId; key: string }[] = [
  { id: 'system', key: 'tab.system' },
  { id: 'ops', key: 'tab.ops' },
  { id: 'impact', key: 'tab.impact' },
];

const SCN_KEY: Record<ScenarioId, string> = {
  acquisition: 'scn.acquisition',
  activation: 'scn.activation',
  retention: 'scn.retention',
  expansion: 'scn.expansion',
  failure: 'scn.failure',
  blocked: 'scn.blocked',
  review: 'scn.review',
  payroll: 'scn.payroll',
  logistics: 'scn.logistics',
  payments: 'scn.payments',
  insurtech: 'scn.insurtech',
  agtech: 'scn.agtech',
  proptech: 'scn.proptech',
  healthtech: 'scn.healthtech',
  edtech: 'scn.edtech',
  cyber: 'scn.cyber',
  openfinance: 'scn.openfinance',
};

const SCN_SUMMARY_KEY: Record<ScenarioId, string> = {
  acquisition: 'scn.acquisition.s',
  activation: 'scn.activation.s',
  retention: 'scn.retention.s',
  expansion: 'scn.expansion.s',
  failure: 'scn.failure.s',
  blocked: 'scn.blocked.s',
  review: 'scn.review.s',
  payroll: 'scn.payroll.s',
  logistics: 'scn.logistics.s',
  payments: 'scn.payments.s',
  insurtech: 'scn.insurtech.s',
  agtech: 'scn.agtech.s',
  proptech: 'scn.proptech.s',
  healthtech: 'scn.healthtech.s',
  edtech: 'scn.edtech.s',
  cyber: 'scn.cyber.s',
  openfinance: 'scn.openfinance.s',
};

export function Header() {
  const {
    view, setView, mode, setMode, runScenario, theme, setTheme,
    motionOn, setMotionOn, resetDemo, lang, setLang, t,
  } = useEngine();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark" aria-hidden>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path d="M20.9 2.6v4.2h-4.2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M6.6 15.4l3.1-3.4 2.3 2.1 4-4.6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="16.6" cy="9" r="1.5" fill="currentColor" />
          </svg>
        </span>
        <span className="brand-name">
          GEOS <em>Growth Engine</em>
        </span>
        <span className="brand-chip">{t('brand.chip')}</span>
      </div>

      <nav className="view-tabs" aria-label="Perspectives">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`view-tab${view === v.id ? ' view-tab--on' : ''}`}
            aria-pressed={view === v.id}
            onClick={() => setView(v.id)}
          >
            {t(v.key)}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <div className="mode-toggle" role="group" aria-label="Storytelling depth">
          <button
            type="button"
            className={`mode-btn${mode === 'executive' ? ' mode-btn--on' : ''}`}
            aria-pressed={mode === 'executive'}
            onClick={() => setMode('executive')}
            title="Executive view — the business story"
          >
            {t('mode.exec')}
          </button>
          <button
            type="button"
            className={`mode-btn${mode === 'builder' ? ' mode-btn--on' : ''}`}
            aria-pressed={mode === 'builder'}
            onClick={() => setMode('builder')}
            title="Builder view — full technical depth"
          >
            {t('mode.builder')}
          </button>
        </div>
        <div className="mode-toggle" role="group" aria-label="Language">
          <button
            type="button"
            className={`mode-btn${lang === 'en' ? ' mode-btn--on' : ''}`}
            aria-pressed={lang === 'en'}
            onClick={() => setLang('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={`mode-btn${lang === 'es' ? ' mode-btn--on' : ''}`}
            aria-pressed={lang === 'es'}
            onClick={() => setLang('es')}
          >
            ES
          </button>
        </div>
        <button
          type="button"
          className="btn btn-icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />}
        </button>
        <button
          type="button"
          className="btn btn-icon"
          onClick={() => setMotionOn(!motionOn)}
          aria-pressed={motionOn}
          aria-label={motionOn ? 'Disable animations' : 'Enable animations'}
          title={motionOn ? 'Animations on — click to disable' : 'Animations off — click to enable'}
        >
          {motionOn ? <Zap size={14} aria-hidden /> : <ZapOff size={14} aria-hidden />}
        </button>
        <button type="button" className="btn btn-icon" onClick={resetDemo} aria-label="Reset demo state" title="Reset demo">
          <RotateCcw size={14} aria-hidden />
        </button>

        <div className="scenario-wrap" ref={menuRef}>
          <button
            type="button"
            className="btn btn-primary run-btn"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Play size={13} aria-hidden />
            <span className="btn-label">{t('run.btn')}</span>
          </button>

          <AnimatePresence>
            {menuOpen ? (
              <motion.nav
                className="scenario-menu"
                role="menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
              >
                <div className="scenario-menu-head">{t('run.menuHead')}</div>
                {SCENARIO_GROUPS.map((group) => (
                  <div key={group.key} className="scenario-group">
                    <div className="scenario-group-head">{t(group.key)}</div>
                    {group.ids.map((id) => {
                      const s = SCENARIOS.find((sc) => sc.id === id);
                      if (!s) return null;
                      const lane = LANE_MAP[s.lane];
                      const isFailure = s.id === 'failure';
                      const isBlocked = s.id === 'blocked';
                      return (
                        <button
                          key={s.id}
                          type="button"
                          role="menuitem"
                          className="scenario-menu-item"
                          onClick={() => {
                            setMenuOpen(false);
                            setView('system');
                            runScenario(s.id);
                          }}
                        >
                          <span
                            className="menu-lane-dot"
                            style={{ background: isFailure || isBlocked ? 'var(--risk)' : lane.color }}
                            aria-hidden
                          />
                          <span>
                            <strong>
                              {t(SCN_KEY[s.id])} — {s.account}
                            </strong>
                            <span>{t(SCN_SUMMARY_KEY[s.id])}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </motion.nav>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
