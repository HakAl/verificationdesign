# Stop Means Stop: Measuring and Repairing the Enforcement Gap in Agent-Framework Control Primitives

Reviewed: 2026-08-16
Reviewer: Codex draft; human review pending
Source: https://arxiv.org/abs/2607.14166
Evidence grade: B
Grade confidence: medium

## Why It Matters

Approval, cancellation, and timeout controls are useful only if their operator-facing stop semantics govern external effects. This paper demonstrates that shipped framework primitives can pause or terminate one control-flow path while a related effect still commits. It also distinguishes framework-local wrapper mediation, which can silently fail open when a tool bypasses the wrapper, from structural network mediation that turns the same omission into a visible fail-closed error.

## Method / Evidence

Read: arXiv v3 abstract and full paper.

- Model-free differential probes tested pinned releases of LangGraph, LlamaIndex Workflows, Microsoft Agent Framework, OpenAI Agents SDK, CrewAI, and LangGraph.js. Five frameworks shipped a pre-execution approval primitive; all five reproduced a sibling approval leak. The matrix also tested replay double-execution, cancellation orphans, and timeout zombies where each primitive was comparable.
- A randomized LangGraph sweep generated 1,000 workflows. Every effect concurrent with the approval gate in the same superstep executed during the pause (577/577); gate-descendant effects did not (0/363), and concurrent effects in later supersteps did not (0/331). This locates the violating window within the superstep that raises the pause rather than in operator reaction time.
- An a-priori-fixed exposure protocol used five models and ten authored tasks. Live end-to-end execution on LangGraph covered four model arms and three leak-driving tasks per model: 215/1,200 unmediated runs leaked, versus 0/1,200 when mediated. The emitting arms had P(leak | emitted)=1.00. A second-runtime replication exercised the GPT-4o arm on LlamaIndex Workflows.
- A search of six public framework trackers produced 13 corroborating incidents across three trackers. The authors correctly treat this as an occurrence lower bound, not a prevalence estimate.
- The proposed external gate, SOUNDGATE, enforces hold-until-decided, reject-cancels, dedup-on-replay, and fence-on-cancel under an explicit complete-mediation contract. End-to-end scripted repair tests covered all six frameworks on their measured violated axes and reduced the live-model LangGraph result from 215 leaks to zero across 1,200 paired runs.
- Verification evidence includes Verus proofs over the sequential admission model, TLA+/TLC exploration up to 74,805,201 states, TLAPS proofs, Loom exploration of the deployed Rust's small concurrent surface, and model-to-code differential conformance over 12 million operations with zero divergences. The paper calls this refinement evidence rather than a mechanized refinement proof.
- Reproducibility signals: the paper links an anonymous artifact containing probes, transcripts, harnesses, formal models, checker logs, and a single-command audit; the GitHub repository is not yet public; and SOUNDGATE v0.1.0 is installable from PyPI. The artifact was not independently executed for this review.
- Authority signals: this is a single-author, unrefereed preprint by an independent researcher. Those facts lower confidence but do not substitute for evaluating the executable evidence.

## Limitations

The study is an unrefereed preprint and one author designed the probes, repair, and evaluation. Framework results are snapshots of pinned releases, with version-stability checks only for LangGraph, so upstream changes may invalidate individual cells. LangGraph receives the deepest coverage, and live model-driven end-to-end coverage reaches only three of the six framework or scheduler integrations; the broader six-framework repair matrix relies on scripted or controlled planners. The main live-model end-to-end experiment covers one runtime, three authored leak-driving tasks, canned tool results, and four model arms; only one arm is repeated on a second runtime. The five-model exposure study covers ten authored tasks, and the naturalistic tau-bench study found ordinary writes were serialized, making the tested gap latent in those episodes. The incident corpus is small and tracker-biased.

The repair guarantee is conditional on complete mediation. Wrapper-only integration can be bypassed by an unwrapped tool. The implemented structural enforcement covers Linux network egress, while shared filesystems, local IPC, shared memory, and other operating systems need additional confinement or placement discipline. The gate does not provide atomicity across multi-phase external actions or read-set freshness during a hold. The single-node admission core is mechanically checked, but the optional Raft machinery is operationally tested rather than verified, and its wide-area measurements are emulated rather than multi-region.

## Suggested Update

Disposition: fold a narrowly scoped warning, subject to maintainer approval. The negative existence claim meets the fold-in bar because deterministic probes reproduce the enforcement gap across named frameworks at pinned versions and isolate a checkable structural boundary. Canonical prose should recommend executable barrier-semantics tests for approval, replay, cancellation, and timeout controls, without generalizing to closed platforms or later releases. Hold the stronger effectiveness claim that SOUNDGATE is a generally sufficient repair: its guarantee depends on complete mediation, and independent replication is not yet available. Do not edit the canonical document as part of this review.

## Claims Needing Human Review

- Whether the cross-framework probe design and anonymous artifact justify grade B before independent execution or peer review.
- Whether canonical prose should name the tested frameworks and pinned versions or state only the general warning with this note as scope.
- Whether the second-runtime live replication is sufficient to describe the same-step mechanism as cross-scheduler evidence.
- Whether the repair should be mentioned only as a candidate pattern until complete-mediation coverage is independently audited.
