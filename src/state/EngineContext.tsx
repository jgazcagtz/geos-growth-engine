import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  AccountEvent,
  AppMode,
  EdgeId,
  Learning,
  LogLine,
  MetricDelta,
  MetricKey,
  NodeId,
  OpEvent,
  ReviewStatus,
  ScenarioId,
  ScoreState,
  SimStatus,
  Toast,
  ViewId,
  ViewStage,
} from '../types';
import { METRICS, METRIC_MAP } from '../data/metrics';
import { SCENARIO_MAP } from '../data/simulations';
import { INITIAL_REVIEW_STATUS } from '../data/reviews';
import { INITIAL_SCORES, applyEffects } from '../data/account';
import { SCENARIO_ACCOUNT } from '../data/accounts';
import { translate, type Lang } from '../i18n';
import { getLayout, type LayoutDef, type LayoutId } from '../data/layouts';

type MetricsState = Record<MetricKey, number>;

const BASE_METRICS = Object.fromEntries(METRICS.map((m) => [m.key, m.value])) as MetricsState;

interface SimState {
  scenarioId: ScenarioId | null;
  status: SimStatus;
  stepIndex: number;
  activeNode: NodeId | null;
  activeEdge: EdgeId | null;
  log: LogLine[];
}

interface EngineValue {
  /* views & modes */
  view: ViewId;
  setView: (v: ViewId) => void;
  mode: AppMode;
  setMode: (m: AppMode) => void;
  /** build progression — MVP is the honest default, VISION the destination */
  stage: ViewStage;
  setStage: (s: ViewStage) => void;
  /** language (UI chrome) + graph layout variant */
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  layout: LayoutId;
  setLayout: (l: LayoutId) => void;
  graph: LayoutDef;
  /* selection & focus */
  selected: NodeId | null;
  select: (node: NodeId | null) => void;
  selectedEdge: EdgeId | null;
  selectEdge: (edge: EdgeId | null) => void;
  inspectStep: number | null;
  openInspect: (stepIndex?: number) => void;
  focusNodes: NodeId[] | null;
  focusMetricKey: MetricKey | null;
  focusMetric: (key: MetricKey | null) => void;
  /** governance hover: highlight the nodes a control protects */
  setHighlight: (nodes: NodeId[] | null) => void;
  panelOpen: boolean;
  closePanel: () => void;
  /** reopen the drawer at the command-center home view */
  openHome: () => void;
  /* metrics */
  metrics: MetricsState;
  recentDelta: (MetricDelta & { id: number }) | null;
  /* learnings */
  learnings: Learning[];
  addLearning: (learning: Learning) => void;
  /* simulation */
  sim: SimState;
  simSpeed: 1 | 1.5;
  setSimSpeed: (s: 1 | 1.5) => void;
  runScenario: (id: ScenarioId) => void;
  pauseSim: () => void;
  resumeSim: () => void;
  stepSim: () => void;
  stopSim: () => void;
  dismissSim: () => void;
  /* human review */
  reviewStatus: Record<string, ReviewStatus>;
  setReviewStatus: (id: string, status: ReviewStatus) => void;
  /* experiments */
  feedbackPulse: number;
  pulseFeedback: () => void;
  /* account lab */
  accountScores: ScoreState;
  applyAccountEvent: (ev: AccountEvent) => void;
  resetAccount: () => void;
  /** which fixture the Account Lab is inspecting (presentation/teaching tool) */
  labAccount: string;
  setLabAccount: (id: string) => void;
  /** which fixture the active/last scenario narrates (domain state) */
  activeAccount: string | null;
  /* ops feed */
  ops: OpEvent[];
  pushOps: (e: Omit<OpEvent, 'id' | 'at'>) => void;
  /* misc */
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toasts: Toast[];
  toast: (text: string, tone?: Toast['tone']) => void;
  motionOn: boolean;
  setMotionOn: (on: boolean) => void;
  motionAllowed: boolean;
  compact: boolean;
  setCompact: (c: boolean) => void;
  resetDemo: () => void;
}

const EngineContext = createContext<EngineValue | null>(null);

const IDLE_SIM: SimState = {
  scenarioId: null,
  status: 'idle',
  stepIndex: 0,
  activeNode: null,
  activeEdge: null,
  log: [],
};

let toastSeq = 0;
let deltaSeq = 0;
let opsSeq = 0;

export function EngineProvider({ children }: { children: ReactNode }) {
  /* motion: OS reduced-motion sets the default; an explicit toggle wins */
  const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const readFlag = (key: string, fallback: boolean) => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : raw === '1';
    } catch {
      return fallback;
    }
  };

  const [motionOn, setMotionOnState] = useState<boolean>(() => readFlag('cge-motion', !prefersReduced()));
  const motionAllowed = motionOn;
  const motionRef = useRef(motionAllowed);
  motionRef.current = motionAllowed;

  const setMotionOn = useCallback((on: boolean) => {
    setMotionOnState(on);
    try {
      window.localStorage.setItem('cge-motion', on ? '1' : '0');
    } catch {
      /* storage unavailable (private mode) — preference is session-only */
    }
  }, []);

  /* theme */
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      return window.localStorage.getItem('cge-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const setTheme = useCallback((t: 'dark' | 'light') => {
    setThemeState(t);
    try {
      window.localStorage.setItem('cge-theme', t);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  /* ------------------------------ views & modes ------------------------------ */

  const [view, setView] = useState<ViewId>('system');
  const [mode, setMode] = useState<AppMode>('builder');
  /* every visit starts at MVP — the narrative is "start small, prove, expand" */
  const [stage, setStage] = useState<ViewStage>('mvp');

  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return window.localStorage.getItem('cge-lang') === 'es' ? 'es' : 'en';
    } catch {
      return 'en';
    }
  });
  const langRef = useRef(lang);
  langRef.current = lang;
  const t = useCallback((key: string) => translate(langRef.current, key), []);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem('cge-lang', l);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const [layout, setLayoutState] = useState<LayoutId>(() => {
    try {
      const raw = window.localStorage.getItem('cge-layout');
      return raw === 'orbit' || raw === 'loop' ? raw : 'columns';
    } catch {
      return 'columns';
    }
  });
  const setLayout = useCallback((l: LayoutId) => {
    setLayoutState(l);
    try {
      window.localStorage.setItem('cge-layout', l);
    } catch {
      /* storage unavailable */
    }
  }, []);
  const graph = useMemo(() => getLayout(layout), [layout]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /* ------------------------------ selection ------------------------------ */

  const [selected, setSelected] = useState<NodeId | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<EdgeId | null>(null);
  const [inspectStep, setInspectStep] = useState<number | null>(null);
  const [focusNodes, setFocusNodes] = useState<NodeId[] | null>(null);
  const [focusMetricKey, setFocusMetricKey] = useState<MetricKey | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const [metrics, setMetrics] = useState<MetricsState>(BASE_METRICS);
  const [recentDelta, setRecentDelta] = useState<(MetricDelta & { id: number }) | null>(null);
  const deltaTimer = useRef<number | null>(null);

  const [learnings, setLearnings] = useState<Learning[]>([]);
  const [reviewStatus, setReviewStatusMap] = useState<Record<string, ReviewStatus>>(INITIAL_REVIEW_STATUS);
  const [feedbackPulse, setFeedbackPulse] = useState(0);

  const [accountScores, setAccountScores] = useState<ScoreState>(INITIAL_SCORES);
  const applyAccountEvent = useCallback((ev: AccountEvent) => {
    setAccountScores((prev) => applyEffects(prev, ev.effects));
  }, []);
  const resetAccount = useCallback(() => setAccountScores(INITIAL_SCORES), []);
  const [labAccount, setLabAccount] = useState<string>('vela');
  const [activeAccount, setActiveAccount] = useState<string | null>(null);

  const [ops, setOps] = useState<OpEvent[]>([]);
  const pushOps = useCallback((e: Omit<OpEvent, 'id' | 'at'>) => {
    setOps((prev) => [
      ...prev.slice(-39),
      { ...e, id: ++opsSeq, at: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
    ]);
  }, []);

  const [sim, setSim] = useState<SimState>(IDLE_SIM);
  const runToken = useRef(0);
  const pausedRef = useRef(false);
  const stepRequestRef = useRef(false);
  const [simSpeed, setSimSpeed] = useState<1 | 1.5>(1);
  const speedRef = useRef<1 | 1.5>(1);
  speedRef.current = simSpeed;

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((text: string, tone: Toast['tone'] = 'default') => {
    const id = ++toastSeq;
    setToasts((prev) => [...prev.slice(-2), { id, text, tone }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200);
  }, []);

  const [compact, setCompact] = useState(false);

  const select = useCallback((node: NodeId | null) => {
    setSelected(node);
    setSelectedEdge(null);
    setInspectStep(null);
    if (node !== null) setPanelOpen(true);
  }, []);

  const selectEdge = useCallback((edge: EdgeId | null) => {
    setSelectedEdge(edge);
    setSelected(null);
    setInspectStep(null);
    if (edge !== null) setPanelOpen(true);
  }, []);

  const openInspect = useCallback((stepIndex?: number) => {
    setInspectStep(stepIndex ?? sim.stepIndex);
    setSelected(null);
    setSelectedEdge(null);
    setPanelOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.stepIndex]);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setSelected(null);
    setSelectedEdge(null);
    setInspectStep(null);
  }, []);

  const openHome = useCallback(() => {
    setSelected(null);
    setSelectedEdge(null);
    setInspectStep(null);
    setPanelOpen(true);
  }, []);

  const focusMetric = useCallback(
    (key: MetricKey | null) => {
      const clearing = key === null || focusMetricKey === key;
      setFocusMetricKey(clearing ? null : key);
      setFocusNodes(clearing ? null : METRIC_MAP[key].contributors);
    },
    [focusMetricKey],
  );

  /** governance hover — highlight without touching the metric-focus state */
  const setHighlight = useCallback((nodes: NodeId[] | null) => {
    setFocusNodes(nodes);
  }, []);

  const applyDelta = useCallback((d: MetricDelta) => {
    setMetrics((prev) => ({ ...prev, [d.key]: prev[d.key] + d.delta }));
    setRecentDelta({ ...d, id: ++deltaSeq });
    if (deltaTimer.current) window.clearTimeout(deltaTimer.current);
    deltaTimer.current = window.setTimeout(() => setRecentDelta(null), 3600);
  }, []);

  /* ----------------------------- learnings ----------------------------- */

  const pulseFeedback = useCallback(() => setFeedbackPulse((n) => n + 1), []);

  const addLearning = useCallback(
    (learning: Learning) => {
      setLearnings((prev) => {
        /* idempotent: shipping the same learning twice must not double-apply */
        if (prev.some((l) => l.id === learning.id)) return prev;
        setFeedbackPulse((n) => n + 1);
        applyDelta({ key: 'lift', delta: 1, text: 'Conversion lift +1pp' });
        toast(translate(langRef.current, 't.learning'), 'success');
        return [...prev, learning];
      });
    },
    [applyDelta, toast],
  );

  /* ------------------------- simulation runner ------------------------- */

  const sleep = (ms: number, token: number) =>
    new Promise<boolean>((resolve) => {
      window.setTimeout(() => resolve(runToken.current === token), ms);
    });

  const runScenario = useCallback(
    (id: ScenarioId) => {
      const scenario = SCENARIO_MAP[id];
      if (!scenario) return;
      const token = ++runToken.current;
      pausedRef.current = false;
      stepRequestRef.current = false;

      const applyStepMetrics = (step: (typeof scenario.steps)[number]) => {
        if (step.metric) applyDelta(step.metric);
        if (step.metric2) applyDelta(step.metric2);
        /* the account's condition changed — its queued review item resolves */
        if (step.resolves) {
          const rid = step.resolves;
          setReviewStatusMap((prev) => (prev[rid] === 'pending' ? { ...prev, [rid]: 'resolved' } : prev));
        }
      };

      const advanceTo = (i: number) => {
        const step = scenario.steps[i];
        setSim((prev) => ({
          ...prev,
          status: pausedRef.current ? 'paused' : 'running',
          stepIndex: i,
          activeNode: step.node,
          activeEdge: step.edge ?? null,
          log: [...prev.log.slice(-7), { key: i, step: i + 1, text: step.title }],
        }));
        applyStepMetrics(step);
      };

      const first = scenario.steps[0];
      setActiveAccount(SCENARIO_ACCOUNT[id] ?? null);
      setSim({
        scenarioId: id,
        status: 'running',
        stepIndex: 0,
        activeNode: first.node,
        activeEdge: first.edge ?? null,
        log: [{ key: 0, step: 1, text: first.title }],
      });
      applyStepMetrics(first);
      setPanelOpen(false);

      const stepMs = () => (motionRef.current ? 1550 : 620) / speedRef.current;

      void (async () => {
        for (let i = 1; i < scenario.steps.length; i++) {
          /* pause gate — a manual "step forward" also resolves here */
          while (pausedRef.current && runToken.current === token) {
            setSim((prev) => (prev.status !== 'paused' ? { ...prev, status: 'paused' } : prev));
            if (!(await sleep(120, token))) return;
            if (stepRequestRef.current) {
              stepRequestRef.current = false;
              advanceTo(i);
            }
          }
          if (runToken.current !== token) return;
          if (!(await sleep(stepMs(), token))) return;
          if (runToken.current !== token) return;
          advanceTo(i);
        }
        if (!(await sleep(stepMs(), token))) return;
        setSim((prev) => ({ ...prev, status: 'done', activeNode: null, activeEdge: null }));
        /* closing the loop registers the scenario's learning exactly once */
        if (scenario.learning) {
          addLearning({ id: scenario.learning.id, text: scenario.learning.text, appliesTo: scenario.learning.appliesTo });
        }
        toast(`${scenario.name} ${translate(langRef.current, 't.complete')}`, 'success');
      })();
    },
    [applyDelta, toast, addLearning],
  );

  const pauseSim = useCallback(() => {
    pausedRef.current = true;
    setSim((prev) => (prev.status === 'running' ? { ...prev, status: 'paused' } : prev));
  }, []);

  const resumeSim = useCallback(() => {
    pausedRef.current = false;
    setSim((prev) => (prev.status === 'paused' ? { ...prev, status: 'running' } : prev));
  }, []);

  /** One manual step forward while paused. */
  const stepSim = useCallback(() => {
    if (!pausedRef.current) return;
    stepRequestRef.current = true;
  }, []);

  const stopSim = useCallback(() => {
    runToken.current += 1;
    pausedRef.current = false;
    setSim(IDLE_SIM);
    toast(translate(langRef.current, 't.stopped'));
  }, [toast]);

  const dismissSim = useCallback(() => {
    runToken.current += 1;
    pausedRef.current = false;
    setSim(IDLE_SIM);
  }, []);

  /* ------------------------------ reviews ------------------------------ */

  const setReviewStatus = useCallback(
    (id: string, status: ReviewStatus) => {
      setReviewStatusMap((prev) => ({ ...prev, [id]: status }));
      const T = (k: string) => translate(langRef.current, k);
      if (status === 'approved') toast(T('t.approved'), 'success');
      if (status === 'modified') toast(T('t.modified'));
      if (status === 'dismissed') toast(T('t.dismissed'));
    },
    [toast],
  );

  /* ------------------------------ reset ------------------------------ */

  const resetDemo = useCallback(() => {
    runToken.current += 1;
    pausedRef.current = false;
    setSim(IDLE_SIM);
    setMetrics(BASE_METRICS);
    setRecentDelta(null);
    setLearnings([]);
    setReviewStatusMap(INITIAL_REVIEW_STATUS);
    setSelected(null);
    setSelectedEdge(null);
    setInspectStep(null);
    setFocusNodes(null);
    setFocusMetricKey(null);
    setPanelOpen(false);
    setOps([]);
    setActiveAccount(null);
    toast(translate(langRef.current, 't.reset'));
  }, [toast]);

  const value = useMemo<EngineValue>(
    () => ({
      view,
      setView,
      mode,
      setMode,
      stage,
      setStage,
      lang,
      setLang,
      t,
      layout,
      setLayout,
      graph,
      selected,
      select,
      selectedEdge,
      selectEdge,
      inspectStep,
      openInspect,
      focusNodes,
      focusMetricKey,
      focusMetric,
      setHighlight,
      panelOpen,
      closePanel,
      openHome,
      metrics,
      recentDelta,
      learnings,
      addLearning,
      sim,
      simSpeed,
      setSimSpeed,
      runScenario,
      pauseSim,
      resumeSim,
      stepSim,
      stopSim,
      dismissSim,
      reviewStatus,
      setReviewStatus,
      feedbackPulse,
      pulseFeedback,
      accountScores,
      applyAccountEvent,
      resetAccount,
      labAccount,
      setLabAccount,
      activeAccount,
      ops,
      pushOps,
      theme,
      setTheme,
      toasts,
      toast,
      motionOn,
      setMotionOn,
      motionAllowed,
      compact,
      setCompact,
      resetDemo,
    }),
    [
      view, mode, stage, lang, t, layout, graph,
      selected, select, selectedEdge, selectEdge, inspectStep, openInspect,
      focusNodes, focusMetricKey, focusMetric, setHighlight, panelOpen, closePanel, openHome,
      metrics, recentDelta, learnings, addLearning, sim, simSpeed, runScenario,
      pauseSim, resumeSim, stepSim, stopSim, dismissSim,
      reviewStatus, setReviewStatus, feedbackPulse, pulseFeedback, accountScores, labAccount, activeAccount,
      applyAccountEvent, resetAccount, ops, pushOps, toasts, toast,
      theme, setTheme, motionOn, motionAllowed, compact, resetDemo,
    ],
  );

  return <EngineContext.Provider value={value}>{children}</EngineContext.Provider>;
}

export function useEngine(): EngineValue {
  const ctx = useContext(EngineContext);
  if (!ctx) throw new Error('useEngine must be used inside EngineProvider');
  return ctx;
}

/** Pause any rAF-driven ambient animation when the tab is hidden. */
export function useVisible(): boolean {
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const on = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  return visible;
}
