# Interview Walkthrough — Growth Engine OS

A 3–5 minute, replayable demo script plus the architecture story, assumptions, and production gaps. The product itself is the deck; this document is the crib sheet.

---

## The 4-minute demo sequence

**0:00 — The destination (System · Vision · Builder)**
Open with the stage selector on **VISION**. One sentence:
> "This is the closed-loop growth system I'd want at a LatAm B2B fintech — signals become account intelligence, an orchestrator decides who/why/what/which, humans approve what matters, outcomes get measured, learnings return."

Point at the three zones: inputs (left), decision (center), execution + outcomes (right), the dashed learning return, governance underneath.

**0:30 — But you don't build this on day one (→ MVP)**
Click **MVP**. ~70% of the graph recedes, each not-yet-built node carrying an explicit "later · Scale/Vision" badge.
> "I wouldn't build all of this first. I'd start with three measurable workflows — account prioritization, an activation agent, and the SDR→AE handoff — because each one pays for itself and each one teaches the next."

**1:00 — One account, end to end (Acquisition run)**
Run **Acquisition — Acme México**. Narrate the causality as the packet travels: pricing intent ×3 → the Account Graph switches to *Acme México* (scenario account) → WHO/WHY/WHAT/WHICH light up sequentially, deterministic ✓s then AI ✓s → the gate fires → approve in the Human node ("approved ✓" chip) → meeting booked → pipeline +$240K → learning returns on the dashed edge. Use **Pause → Inspect** on the NBA step to show the raw event (prompt version, guardrail checks, idempotency key).

**2:00 — The system says NO (Governance block run)**
Run **Governance block**. The amber `blocked · cap 2/2` chip is the punchline:
> "A confident AI recommendation dies at a deterministic frequency cap. Blocked ≠ deleted: it's deferred, audit-logged, and the block-rate is itself a KPI. Rules govern what must stay predictable."

**2:30 — Honesty under low confidence (Low-confidence review run)**
Run **Low-confidence review**: conflicting signals (intent ↑, engagement ↓), confidence 0.54 < 0.75 threshold → the engine **abstains**, requests information instead of approval, and no metric moves.
> "The alternative here was a confident guess. Abstention is an outcome."

**3:00 — What it produced (Impact)**
Switch to **Impact**. Point at the attribution chips: Attributed (holdout comparisons only) / Influenced / Correlated — hover for definitions. Activation and time-to-value are tagged **live** (they include the runs you just executed); the rest are labeled simulated samples. Show the **killed** experiment (EXP-017) and its written reason.

**3:30 — Operating it (Operations)**
Switch to **Operations**: live feed, the approval queue with SLAs, automation health with failures/escalations/LLM cost. Note the Nova Retail item flips to **resolved** when its account reaches first value in the activation run — queues reflect current state, not history.

**4:00 — Reusability (Account Graph → Account lab)**
Open the **Account Graph** node → Account Lab → switch to **Mediterra Studios** (non-fintech SaaS fixture): same engine, same UI, trial milestones instead of card issuance.
> "The growth logic isn't fintech-specific; the fixtures are."

Close with the Executive mode toggle (60-second narrative) if time allows.

---

## Architecture (repository map)

```
src/
  types.ts                 domain model (Node/Edge/Workflow/Scenario/Metric/PacketKind…)
  data/                    ALL content & geometry, render-free
    layouts.ts             3 graph layouts (columns/orbit/loop) + runtime geometry
    architecture.ts        topology + build-stage maps (id-based, layout-agnostic)
    accounts.ts            synthetic fixtures (fintech + non-fintech) & scenario↔account
    simulations.ts         7 scripted scenarios incl. failure, governance block, low-confidence
    workflows.ts           one inspectable automation per edge + EDGE_FLOW payloads
    impact.ts / metrics.ts attribution-honest metrics; ops feed templates
    gtm.ts                 SDR copilot, handoff object, lifecycle trigger rules
  state/EngineContext.tsx  single source of truth: domain (runs, learnings, reviews,
                           active account, metrics) + presentation prefs (theme/lang/layout)
  components/
    canvas/                graph, semantic packets, node views, edge inspector
    views/                 System · Operations · Impact
    panel/                 drawer: node detail, workflow inspector, copilot, labs, exec
  i18n.ts                  EN/ES dictionaries (chrome + views; deep prose EN by design)
```

**Causal model:** signal → account context → recommendation → policy checks → approval when required → execution → outcome → measurement → learning → orchestrator config. Governance gates execution everywhere; no external action is portrayed before approval.

## Key design decisions & tradeoffs

- **Deterministic vs AI split is visual** — the orchestrator literally checks off rules first, then AI. The claim "AI isn't responsible for everything" is demonstrated, not stated.
- **MVP-default** — every reload starts at the honest beginning; VISION is a destination, not a day-1 plan.
- **Idempotent learnings** — replaying a scenario or re-shipping a learning never double-counts (guarded by learning id).
- **Queue truthfulness** — scenario outcomes resolve their review items (`resolves`), so Operations reflects current state.
- **One active account** — scenario runs set `activeAccount`; graph, approvals and ops all read it. The Account Lab fixture is clearly labeled as an inspection tool, separate from the run.
- **Honest statistics** — p-values are labeled "synthetic · illustrative"; attribution definitions exclude single-touch "proof"; experiments can be killed.
- **Data ≠ rendering** — layouts, scenarios, metrics, and copy are data files; components are generic. The SaaS fixture proves it.

## Assumptions (all labeled in-product)

- Everything numeric is **simulated**; market context (LatAm mid-market ICP, manual-spend dominance) is public reporting.
- The stack suggestions ("Possible implementation": HubSpot-class CRM, Clay/Apollo-class enrichment, Customer.io, n8n, Metabase, LLM APIs) are proposals, not claims about any employer.
- Growth recommendations never authorize regulated financial actions (limits/credit remain product decisions).

## Production gaps (what the demo fakes, honestly)

1. **Real integrations** — ingest, CRM writeback, WhatsApp/email delivery, warehouse. Here: scripted fixtures and workflow inspectors.
2. **Statistical engine** — experiment readouts need real assignment, power analysis and significance computation. Here: illustrative fixtures.
3. **Identity resolution** — real probabilistic matching with review queues. Here: a fixture with "clean" status.
4. **Multi-tenant config** — fixtures/segment rules would live in a config service, not code.
5. **Auth/RBAC/audit persistence** — simulated badges; production needs SSO-scoped roles and an append-only audit store.
6. **Observability backends** — health numbers would come from workflow runtime metrics (runs, retries, cost), not constants.

## Verification notes

Manual browser matrix executed: all 7 scenarios to terminal state (approve/modify/dismiss, block, failure, abstain); pause/step/restart/stop/reset; mid-run layout/language/theme/mode/stage switches; EN+ES across all views; 3 layouts at 1687×841, 1440×900, 1366×768, 1280×800, 1024 and 390 widths; dark+light; reduced-motion; console error-free. This document deliberately claims nothing beyond that.
