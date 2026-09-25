# Threat Model

## Project Overview

This workspace hosts a public Replit deployment with two production-reachable artifacts: a static React/Vite web app at `/mcn-pdtic/` and an Express 5 API at `/api`. The frontend lets users upload and analyze PDTIC documents in the browser, while the API exposes a server-side AI analysis endpoint backed by Anthropic. The deployment is public, TLS is platform-managed, and `NODE_ENV` is production in deployed services.

## Assets

- **Uploaded PDTIC document contents** — user-supplied documents may contain internal planning details, names, governance records, procurement information, or other sensitive institutional data.
- **Anthropic integration credentials and quota** — abuse of the server-side Anthropic client can consume billable quota and indirectly expose the application as a relay for third-party analysis.
- **Service availability** — the public API can be targeted for computational or streaming abuse that degrades the service or exhausts provider limits.
- **Browser-stored evaluation data** — institution names, evaluator names, observations, and assessment results are stored in the user’s browser and may be sensitive on shared machines.

## Trust Boundaries

- **Browser to API** — all requests to `/api` cross from an untrusted client into the backend. Request bodies, headers, and streamed connections must be treated as attacker-controlled.
- **API to Anthropic** — the backend sends selected user content to a third-party LLM service using server-held credentials.
- **Public internet to deployment** — the deployment is publicly reachable; unauthenticated endpoints are internet-exposed and must tolerate arbitrary callers.
- **Frontend origin to browser storage** — the React app persists evaluation data into `localStorage`; any script execution in the app origin would expose that data.
- **Dev-only to production boundary** — `artifacts/mockup-sandbox/`, `scripts/`, and codegen sources under `lib/api-spec/` are out of production scope unless separately wired into deployed artifacts.

## Scan Anchors

- Production API entry: `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`
- Production API routes: `artifacts/api-server/src/routes/health.ts`, `artifacts/api-server/src/routes/analyze.ts`
- Frontend app entry: `artifacts/mcn-pdtic/src/main.tsx`, `artifacts/mcn-pdtic/src/App.tsx`
- Sensitive client storage: `artifacts/mcn-pdtic/src/context/EvaluationContext.tsx`
- Third-party AI boundary: `lib/integrations-anthropic-ai/src/client.ts`
- Dev-only areas to usually ignore: `artifacts/mockup-sandbox/`, `scripts/`, `lib/api-spec/`

## Threat Categories

### Spoofing

There is currently no authentication layer on the production API. For this project, the main spoofing concern is not account impersonation but unauthorized callers presenting themselves as legitimate application users. The system must ensure that any endpoint capable of spending server-side resources or handling sensitive document content is intentionally public or protected by a server-enforced access gate.

### Tampering

The browser and any direct API caller are untrusted. The API must validate all request bodies, reject malformed or oversized structured input consistently, and avoid trusting client-provided classifications or identifiers beyond their intended display semantics. If AI-generated results are accepted, they must be treated as untrusted output and not as authoritative security or authorization data.

### Information Disclosure

User-submitted PDTIC text is a high-value asset because it may contain internal institutional information. The application must clearly constrain where that content flows, avoid leaking it through logs or verbose errors, and ensure only intended services receive it. Browser-stored evaluation data should be assumed readable by any script executing in the same origin. This project intentionally advertises client-side persistence of evaluation data in `localStorage`, so persistence alone is not a finding; future scans should instead focus on mismatches between user deletion expectations and actual data retention.

### Denial of Service

The public deployment exposes an API endpoint that can trigger long-lived SSE responses and costly LLM calls. The system must prevent unbounded anonymous use, enforce reasonable request sizes and connection lifetimes, and apply server-side throttling or other abuse controls so a public attacker cannot exhaust Anthropic quota or tie up the service with concurrent analysis requests.

### Elevation of Privilege

This codebase has no role model or admin surface today, so classic role escalation is not the primary concern. The more relevant privilege boundary is between anonymous internet users and server-held capabilities such as paid Anthropic access. Anonymous callers must not be able to exercise privileged backend resources beyond what the product explicitly intends.