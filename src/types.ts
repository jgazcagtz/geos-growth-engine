/* ------------------------------------------------------------------ */
/* Domain model — the typed vocabulary of the Growth Engine blueprint */
/* ------------------------------------------------------------------ */

export type NodeId =
  | 'signals-1p'
  | 'signals-ext'
  | 'account-graph'
  | 'orchestrator'
  | 'lifecycle'
  | 'channels'
  | 'human'
  | 'outcomes'
  | 'experiments'
  | 'governance';

export type EdgeId =
  | 'e-signals-1p'
  | 'e-signals-ext'
  | 'e-graph-orch'
  | 'e-orch-lanes'
  | 'e-lanes-channels'
  | 'e-channels-human'
  | 'e-human-outcomes'
  | 'e-channels-outcomes'
  | 'e-outcomes-experiments'
  | 'e-experiments-orch';

export type LaneId = 'acquire' | 'activate' | 'retain' | 'expand';

export type ChannelId =
  | 'email'
  | 'whatsapp'
  | 'in-product'
  | 'crm-tasks'
  | 'sales-alert'
  | 'cs-alert'
  | 'paid'
  | 'human-outreach';

export type MetricKey =
  | 'qualified'
  | 'pipeline'
  | 'activationRate'
  | 'ttv'
  | 'adoption'
  | 'expansionOpps'
  | 'revenue'
  | 'experimentsRunning'
  | 'lift';

export type ScenarioId =
  | 'acquisition'
  | 'activation'
  | 'retention'
  | 'expansion'
  | 'failure'
  | 'blocked'
  | 'review'
  /* vertical scenario library — same engine, different LatAm B2B categories */
  | 'payroll'
  | 'logistics'
  | 'payments'
  | 'insurtech'
  | 'agtech'
  | 'proptech'
  | 'healthtech'
  | 'edtech'
  | 'cyber'
  | 'openfinance';

/** Top-level perspectives of the operating system. */
export type ViewId = 'system' | 'ops' | 'impact';

/** Storytelling depth: builder shows internals, executive shows the business story. */
export type AppMode = 'builder' | 'executive';

/** Honest data labeling required for the demo. */
export type Provenance = 'known' | 'proposed' | 'simulated';

/* ------------------------------ geometry ------------------------------ */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Side = 'top' | 'right' | 'bottom' | 'left';

export interface Pt {
  x: number;
  y: number;
}

/* ------------------------------ architecture ------------------------------ */

export type NodeKind = 'sources' | 'intelligence' | 'decision' | 'execution' | 'outcome' | 'learning' | 'control';

export interface SystemNode {
  id: NodeId;
  kind: NodeKind;
  title: string;
  rect: Rect;
}

export type EdgeKind = 'data' | 'action' | 'feedback';

/** What a travelling packet semantically IS — drives its visual form + color. */
export type PacketKind = 'event' | 'data' | 'ai' | 'action' | 'governance' | 'result' | 'learning';

/** Build progression: how much of the destination system exists yet. */
export type ViewStage = 'mvp' | 'scale' | 'vision';

export interface EdgeSpec {
  id: EdgeId;
  from: NodeId;
  fromSide: Side;
  fromOffset?: number;
  to: NodeId;
  toSide: Side;
  toOffset?: number;
  kind: EdgeKind;
  label?: string;
  /** render the label rotated −90° (for narrow vertical gutters) */
  labelVertical?: boolean;
  /** nudge the label from its computed midpoint (design px) */
  labelDx?: number;
  labelDy?: number;
  /** override the auto control-point length for tight or looped edges */
  cLen?: number;
  /** number of ambient particles travelling this edge (0–3) */
  particles?: number;
  /** semantic packet type carried by this connector */
  flow?: PacketKind;
}

export interface EdgeGeom {
  id: EdgeId;
  kind: EdgeKind;
  d: string;
  labelAt: Pt;
  hasLabel: boolean;
  labelVertical: boolean;
}

/* ------------------------------ detail panel ------------------------------ */

export interface NodeExample {
  signal: string;
  reasoning: string;
  action: string;
}

export interface NodeDetail {
  id: NodeId;
  tagline: string;
  purpose: string;
  inputs: string[];
  deterministic?: string[];
  ai?: string[];
  outputs: string[];
  example?: NodeExample;
  kpi: string;
  kpiNote?: string;
  /** candidate stack — explicitly labeled as a proposal, never a company fact */
  implementation?: string[];
}

/* ------------------------------ signals / channels ------------------------------ */

export interface SignalItem {
  id: string;
  label: string;
  /** short note shown in the panel */
  note?: string;
  /** connected = available today · potential = connect over time */
  status?: 'connected' | 'potential';
  /** build stage at which this signal joins the system */
  stage?: ViewStage;
}

export interface SignalGroup {
  id: 'signals-1p' | 'signals-ext';
  title: string;
  subtitle: string;
  cadence: string;
  items: SignalItem[];
}

export interface Channel {
  id: ChannelId;
  label: string;
  note: string;
  /** build stage at which this channel is wired up */
  stage?: ViewStage;
}

/* ------------------------------ lifecycle ------------------------------ */

export interface LifecycleLane {
  id: LaneId;
  name: string;
  color: string;
  flow: string;
  scenario: ScenarioId;
}

/* ------------------------------ metrics ------------------------------ */

export type MetricFormat = 'int' | 'usdCompact' | 'percent' | 'days' | 'signed';

export interface Metric {
  key: MetricKey;
  label: string;
  value: number;
  format: MetricFormat;
  contributors: NodeId[];
  note: string;
}

/* ------------------------------ simulation ------------------------------ */

export interface MetricDelta {
  key: MetricKey;
  delta: number;
  text: string;
}

export interface SimulationStep {
  node: NodeId;
  edge?: EdgeId;
  lane?: LaneId;
  channel?: ChannelId;
  title: string;
  detail: string;
  metric?: MetricDelta;
  /** optional second delta (e.g. an expansion that also moves pipeline) */
  metric2?: MetricDelta;
  /** raw event payload for the inspector (pause → inspect) */
  inspect?: InspectPayload;
  /** short-lived micro-event chip rendered at the active node */
  micro?: string;
  /** blocked chips render amber — governance said no */
  microTone?: 'ok' | 'blocked';
  /** review item this step resolves (its account condition changed) */
  resolves?: string;
}

export interface ScenarioLearning {
  id: string;
  text: string;
  appliesTo: string;
}

export interface SimulationScenario {
  id: ScenarioId;
  lane: LaneId;
  name: string;
  account: string;
  summary: string;
  steps: SimulationStep[];
  /** registered exactly once when the run completes its loop */
  learning?: ScenarioLearning;
}

export type SimStatus = 'idle' | 'running' | 'paused' | 'done';

/** Raw-ish event payload exposed by the simulation inspector (builder mode). */
export interface InspectPayload {
  event: string;
  fields: [string, string][];
}

export interface LogLine {
  key: number;
  step: number;
  text: string;
}

/* ------------------------------ account lab ------------------------------ */

export type ScoreKey = 'icp' | 'intent' | 'engagement' | 'activation' | 'expansion' | 'risk';

export type ScoreState = Record<ScoreKey, number>;

export interface ScoreMeta {
  key: ScoreKey;
  label: string;
  hint: string;
}

export interface AccountEvent {
  id: string;
  label: string;
  source: string;
  effects: Partial<ScoreState>;
  insight: string;
}

export interface SampleAccount {
  name: string;
  firmographics: string;
  domain: string;
  enrichment: string[];
  relationships: { label: string; value: string }[];
  base: ScoreState;
}

/* ------------------------------ human review ------------------------------ */

export type ReviewStatus = 'pending' | 'approved' | 'modified' | 'dismissed' | 'resolved';

export interface ReviewItem {
  id: string;
  account: string;
  signal: string;
  whyNow: string[];
  recommended: string;
  channel: string;
  confidence: 'High' | 'Medium';
  impact: string;
}

/* ------------------------------ experiments ------------------------------ */

export type ExperimentStatus = 'draft' | 'running' | 'shipped' | 'killed';

export interface ExperimentResult {
  variantA: string;
  variantB: string;
  metricLabel: string;
  a: number;
  b: number;
  unit: string;
  sample: number;
  pValue: string;
  winner: 'A' | 'B';
  lift: number;
}

export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  audience: string;
  result: ExperimentResult;
  learning: string;
  appliesTo: string;
  status: ExperimentStatus;
}

export interface Learning {
  id: string;
  text: string;
  appliesTo: string;
}

/* ------------------------------ ui ------------------------------ */

export type PanelView = 'home' | 'inspect' | NodeId;

export interface Toast {
  id: number;
  text: string;
  tone: 'default' | 'success';
}

/* ------------------------------ workflows (automation registry) ------------------------------ */

export type WorkflowStepKind =
  | 'trigger'
  | 'filter'
  | 'enrich'
  | 'ai'
  | 'decision'
  | 'route'
  | 'action'
  | 'sync'
  | 'measure';

export interface WorkflowStep {
  name: string;
  kind: WorkflowStepKind;
  input: string;
  output: string;
  owner: string;
  latency: string;
  lastRun: string;
  status: 'healthy' | 'warn' | 'error';
  error?: string;
  purpose: string;
}

export interface WorkflowHealth {
  runsToday: number;
  successPct: number;
  escalations: number;
  failures: number;
  medianRuntime: string;
  llmCost: string;
  pipelineInfluenced: string;
}

/** One automation = one edge on the canvas. Inspectable end to end. */
export interface WorkflowSpec {
  id: EdgeId;
  name: string;
  code: string;
  purpose: string;
  trigger: string;
  steps: WorkflowStep[];
  health: WorkflowHealth;
}

/* ------------------------------ operations feed ------------------------------ */

export type OpKind =
  | 'signal'
  | 'qualification'
  | 'action'
  | 'approval'
  | 'handoff'
  | 'lifecycle'
  | 'experiment'
  | 'learning'
  | 'error'
  | 'sync';

export interface OpTarget {
  type: 'node' | 'workflow' | 'review' | 'exp';
  id: string;
}

export interface OpEvent {
  id: number;
  at: string;
  kind: OpKind;
  account?: string;
  text: string;
  open?: OpTarget;
}

/* ------------------------------ impact (attribution-honest metrics) ------------------------------ */

export type Attribution = 'attributed' | 'influenced' | 'correlated';

export interface ImpactMetric {
  key: string;
  label: string;
  value: string;
  attribution: Attribution;
  trend: string;
  note: string;
  /** when set, the Impact view reads this metric live from the run state */
  liveKey?: 'activationRate' | 'ttv';
}

/* ------------------------------ build → measure → iterate ------------------------------ */

export interface LoopStage {
  key: string;
  label: string;
  example: string;
}

/* ------------------------------ SDR copilot ------------------------------ */

export interface CopilotContact {
  name: string;
  role: string;
  persona: string;
  engagement: string;
}

export interface CopilotSignal {
  text: string;
  when: string;
  source: string;
}

export interface CopilotDraft {
  channel: string;
  localization: string;
  confidence: number;
  provenance: string[];
  text: string;
}

/* ------------------------------ SDR → AE handoff ------------------------------ */

export interface HandoffObject {
  account: string;
  contact: string;
  qualification: string[];
  conversation: string[];
  pains: string[];
  productInterest: string[];
  intent: string[];
  talkingPoints: string[];
  source: string;
  research: string;
  crmHistory: string;
}

/* ------------------------------ lifecycle automation lab ------------------------------ */

export interface LifecycleEventDef {
  event: string;
  meaning: string;
  stage: 'signup' | 'setup' | 'activation' | 'adoption' | 'retention' | 'expansion';
}

export interface TriggerRule {
  trigger: string;
  interpretation: string;
  action: string;
  channel: string;
  personalization: string;
  success: string;
  guardrail: string;
}
