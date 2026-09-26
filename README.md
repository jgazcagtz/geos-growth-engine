# GEOS — Growth Engine Operating System

A working prototype of how an **AI Growth Automation Engineer** would operate growth at a LatAm B2B fintech (the corporate-spend category: corporate cards, spend management, accounts payable; markets Mexico, Brazil, Colombia; mid-market ICP of 100–1,000 FTE companies).

Not an architecture infographic — a **Growth Operating System** told at two levels at once:

- **VISION** — the complete closed loop: signals → Account Graph → Growth Orchestrator (WHO / WHY now / WHAT / WHICH) → lifecycle playbooks → channels → human approval gates → pipeline · adoption · revenue → experimentation → learnings return to decisioning.
- **MVP** (the default) — the three measurable workflows that would actually be built first: **01 account prioritization · 02 activation agent · 03 SDR→AE handoff**. A **SCALE** stage adds enrichment, lifecycle playbooks and experimentation. The progression selector sits above the canvas.

Three connected perspectives:

- **System** — the living engine. Every **edge is an inspectable workflow** (trigger, steps, input/output, owner, latency, health, cost); every **node** opens purpose, deterministic-vs-AI logic, example stack and KPI.
- **Operations** — what is happening *right now*: live event stream, approval queue with SLAs, automation health, exceptions with retries and fallbacks.
- **Impact** — role metrics labeled **ATTRIBUTED / INFLUENCED / CORRELATED**, the build → measure → iterate loop, and an experiment board where losers get killed with a written reason.

Two storytelling depths: **Builder** (events, payloads, prompt versions, idempotency, guardrails) and **Executive** (problem → system → decision → execution → human → outcome → learning, in ~60 seconds).

## Run locally

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

## Production build

```bash
npm run build     # type-checks with tsc, then bundles to dist/
npm run preview   # serve the production build locally
```

Static SPA (`base: './'`) — deployable to Vercel/Netlify/any static host, zero config.

## What to try (5-minute tour)

1. Notice you start in **MVP**: three workflows lit, the rest of the destination architecture receded. Click **SCALE**, then **VISION**.
2. **Run growth simulation** — six scenarios: acquisition, activation, retention, expansion, an **automation failure run** (outage → retries → fallback → escalation), and a **governance block run** where rules stop a confident AI recommendation. Pause / Step / Skip / Restart / 1.5× / ESC to exit; **Inspect** any step's raw event payload.
3. Click **any edge** — hover shows the payload; click opens the workflow inspector (steps, owners, latency, health, LLM cost).
4. Open the **Account Graph** node — fire signals, watch scores and the next best action recompute, then use the **SDR Copilot**: committee, signal timeline, localized draft with provenance, and Approve / Edit / Research more / Assign / Skip.
5. Open the **Growth lifecycle** node — behavioral event taxonomy, a live trigger rule, and the **SDR → AE handoff** (bad vs good).
6. **Impact** — attribution-honest metrics and the experiment board, including a **killed** experiment.
7. **Executive / Builder** toggle — same system, two audiences. **Sun/Moon** for light/dark; **⚡** toggles animation (OS reduced-motion sets the default).

## Data labeling (deliberate)

- **KNOWN** — public LatAm B2B market context (manual-spend dominance, single-digit card/software penetration in the mid-market).
- **PROPOSED** — the architecture, workflows and stacks (labeled "Possible implementation").
- **SIMULATED** — every metric, feed event, account and experiment result (labeled "SIMULATED SCENARIO").

The scenario assumes a fictional company in the category. Nothing here claims to be any real company's internals or numbers.

## Architecture (code)

```
src/
  types.ts                  strongly typed domain model
  data/                     all content & geometry, separated from rendering
    architecture.ts         design grid, edges, build-stage maps, topology
    workflows.ts            the automation registry (one workflow per edge)
    ops.ts · impact.ts      live feed · attribution-honest metrics
    gtm.ts                  SDR copilot, handoff, lifecycle trigger rules
    details.ts              builder panel content (+ implementation stacks)
    details-exec.ts         executive briefs
    simulations.ts          six scripted scenarios incl. failure & governance-block
  state/EngineContext.tsx   views, modes, stage, selection, simulation, ops feed
  components/
    canvas/                 graph, semantic packets, edge inspector, node views
    views/                  System · Operations · Impact
    panel/                  drawer: nodes, workflow inspector, copilot, labs, exec
    SimulationBar.tsx · Header.tsx · Toasts.tsx
    compact/VerticalFlow.tsx
```

## Accessibility & performance

- Full keyboard navigation (nodes and edges reachable; `Esc` closes panels / exits simulations).
- `prefers-reduced-motion` sets the default; the in-app motion toggle overrides. All motion is causal.
- One shared `requestAnimationFrame` loop; ambient traffic is sparse and semantic.
- Responsive: optimized for 1920×1080 / 1440×900 / 1366×768; below ~760px the graph reflows into a vertical flow with a full-width drawer.

## Note

An interview prototype: identify growth bottlenecks, build systems that remove them, keep rules deterministic, AI probabilistic and humans in the loop — then prove with data whether it worked.
