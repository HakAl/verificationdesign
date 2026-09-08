# Verification plan

Artifact: skills/fixtures/design-sound/artifact

Scope: Verify the pure square function against its exact integer specification.

Corpus revision: `e632a86b2ca8fbb7f83b3130ba083784c7817667`

Corpus tag: `corpus/v1.0.0`

## Workflow characterization

Generated: A pure Python square function.

Generator: A one-shot code-generating agent.

Completion signal: Existing local equality assertions exit successfully.

Self-review points: None recorded.

## Patterns applied

### Executable Analog

[Executable Analog](https://verificationdesign.com/patterns/verification/executable-analog/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/executable-analog.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

An assertion compares the pure function result against a specified integer, repeatedly in a local regression check.

- use_when: the claim being verified can be expressed as a deterministic check (holds). Evidence: artifact/workflow.md:3-16: An assertion compares the pure function result against a specified integer, repeatedly in a local regression check.
- use_when: the output has structure (DOM, JSON, exit code, log line) that can be queried (holds). Evidence: artifact/workflow.md:3-16: An assertion compares the pure function result against a specified integer, repeatedly in a local regression check.
- use_when: you can write a test rather than just describe one (holds). Evidence: artifact/workflow.md:3-16: An assertion compares the pure function result against a specified integer, repeatedly in a local regression check.
- use_when: the same check will run repeatedly (regression, CI, multi-agent loops) (holds). Evidence: artifact/workflow.md:3-16: An assertion compares the pure function result against a specified integer, repeatedly in a local regression check.

Observable signals:

- check_id: the named check being run
- expected: the value the executable analog is checking against
- observed: the raw value returned by the extractor, before judgment
- passed: the strict comparison result
- error: the exception text when extraction fails, otherwise None.

Determinism move: Executable Analog constrains `self_review_bias` (the same agent that produced the artifact no longer judges whether it satisfies the check) and `judge_subjectivity` (the verdict comes from a deterministic equality on extracted values, not from a model's interpretation of rendered output). By forcing extract-then-compare instead of interpret-and-decide, the system loses the freedom to rationalize a coincidental pass.

### Comparator

[Comparator](https://verificationdesign.com/patterns/verification/comparator/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/comparator.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

Expected and observed integers are separate and equality is the named comparison operator.

- use_when: the check has a known expected value, pattern, reference object, or expected event sequence (holds). Evidence: artifact/workflow.md:3-16: Expected and observed integers are separate and equality is the named comparison operator.
- use_when: the observed value can be extracted separately from the comparison (holds). Evidence: artifact/workflow.md:3-16: Expected and observed integers are separate and equality is the named comparison operator.
- use_when: a named operator covers the comparison or can be defined cheaply (holds). Evidence: artifact/workflow.md:3-16: Expected and observed integers are separate and equality is the named comparison operator.
- use_when: the same comparison will run repeatedly in CI, regression tests, or agent loops. (holds). Evidence: artifact/workflow.md:3-16: Expected and observed integers are separate and equality is the named comparison operator.

Observable signals:

- operator name
- expected value or reference
- observed value extracted before comparison
- normalization steps applied before comparison
- notes for recorded parse or pattern failures
- score and threshold
- pass/fail verdict.

Determinism move: Comparator constrains `judge_subjectivity` by making the verdict a deterministic function of expected value, observed value, operator, threshold, and normalization. It constrains `criteria_drift` because a named operator is stable across runs in a way that a prompt-based judge's interpretation is not.

## Patterns rejected

### Constitution

[Constitution](https://verificationdesign.com/patterns/context-and-state/constitution/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/constitution.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

The small local harness has one executable check, no audit report consumer, no drifting prompt criteria and no comparison of failures across runs.

- use_when: multiple agents or tools evaluate the same artifact (does-not-hold). Evidence: artifact/workflow.md:3-16: The small local harness has one executable check, no audit report consumer, no drifting prompt criteria and no comparison of failures across runs.
- use_when: verification reports need to be auditable (does-not-hold). Evidence: artifact/workflow.md:3-16: The small local harness has one executable check, no audit report consumer, no drifting prompt criteria and no comparison of failures across runs.
- use_when: criteria drift is causing inconsistent judgments (does-not-hold). Evidence: artifact/workflow.md:3-16: The small local harness has one executable check, no audit report consumer, no drifting prompt criteria and no comparison of failures across runs.
- use_when: prompts contain repeated pass/fail language (does-not-hold). Evidence: artifact/workflow.md:3-16: The small local harness has one executable check, no audit report consumer, no drifting prompt criteria and no comparison of failures across runs.
- use_when: failures must be compared across runs (does-not-hold). Evidence: artifact/workflow.md:3-16: The small local harness has one executable check, no audit report consumer, no drifting prompt criteria and no comparison of failures across runs.
- use_when: human reviewers need to know what the system actually checked. (does-not-hold). Evidence: artifact/workflow.md:3-16: The small local harness has one executable check, no audit report consumer, no drifting prompt criteria and no comparison of failures across runs.

### Guardrail Decorator

[Guardrail Decorator](https://verificationdesign.com/patterns/context-and-state/guardrail-decorator/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/guardrail-decorator.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

No lifecycle hooks, policy enforcement or model tool boundary exists; the function receives ordinary local integers.

- use_when: the framework supports lifecycle hooks at model, tool, retriever, or output boundaries (does-not-hold). Evidence: artifact/workflow.md:3-16: No lifecycle hooks, policy enforcement or model tool boundary exists; the function receives ordinary local integers.
- use_when: policy enforcement gates side effects such as file writes, network calls, deletions, charges, sends, or deploys (does-not-hold). Evidence: artifact/workflow.md:3-16: No lifecycle hooks, policy enforcement or model tool boundary exists; the function receives ordinary local integers.
- use_when: policy needs to survive prompt rewrites, persona tests, and context compaction (does-not-hold). Evidence: artifact/workflow.md:3-16: No lifecycle hooks, policy enforcement or model tool boundary exists; the function receives ordinary local integers.
- use_when: audit requires a decision log per call (does-not-hold). Evidence: artifact/workflow.md:3-16: No lifecycle hooks, policy enforcement or model tool boundary exists; the function receives ordinary local integers.
- use_when: the policy can be expressed as a deterministic decision function rather than a subjective judgment. (does-not-hold). Evidence: artifact/workflow.md:3-16: No lifecycle hooks, policy enforcement or model tool boundary exists; the function receives ordinary local integers.

### Causal Tag

[Causal Tag](https://verificationdesign.com/patterns/context-and-state/causal-tag/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/causal-tag.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

No shared event surface or asynchronous work exists; each result is a private function return.

- do_not_use_when: the event surface is fully private to the test or run (holds). Evidence: artifact/workflow.md:3-16: No shared event surface or asynchronous work exists; each result is a private function return.
- do_not_use_when: the side effect is low stakes and misattribution cost is negligible. (holds). Evidence: artifact/workflow.md:3-16: No shared event surface or asynchronous work exists; each result is a private function return.

### Trajectory Cursor

[Trajectory Cursor](https://verificationdesign.com/patterns/context-and-state/trajectory-cursor/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/trajectory-cursor.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

Generation is one-shot and the check has no agent decisions, retries or pause/resume path.

- do_not_use_when: the workflow is a single-shot model call with no loop (holds). Evidence: artifact/workflow.md:3-16: Generation is one-shot and the check has no agent decisions, retries or pause/resume path.
- do_not_use_when: the process is a deterministic transformation pipeline with no agent decisions (holds). Evidence: artifact/workflow.md:3-16: Generation is one-shot and the check has no agent decisions, retries or pause/resume path.

### State Baseline

[State Baseline](https://verificationdesign.com/patterns/context-and-state/state-baseline/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/state-baseline.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

The property is internal to a deterministic function; there is no mutable environment.

- do_not_use_when: the verified property is purely internal to a deterministic function call (holds). Evidence: artifact/workflow.md:3-16: The property is internal to a deterministic function; there is no mutable environment.

### Blind Oracle

[Blind Oracle](https://verificationdesign.com/patterns/verification/blind-oracle/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/blind-oracle.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

Expected can be derived, but the executable assertion specializes the pattern and no model judge is used.

- do_not_use_when: Executable Analog can specialize the pattern with compilation, execution, or runtime traces (holds). Evidence: artifact/workflow.md:3-16: Expected can be derived, but the executable assertion specializes the pattern and no model judge is used.

### Delta

[Delta](https://verificationdesign.com/patterns/verification/delta/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/delta.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

No environmental metric or mutation exists; the only observation is a private function return.

- do_not_use_when: the environment is fully ephemeral (fresh container per run, mocked DB) (holds). Evidence: artifact/workflow.md:3-16: No environmental metric or mutation exists; the only observation is a private function return.
- do_not_use_when: the metric does not exist pre-action and only the absolute post-state is meaningful (holds). Evidence: artifact/workflow.md:3-16: No environmental metric or mutation exists; the only observation is a private function return.

### Judge Harness

[Judge Harness](https://verificationdesign.com/patterns/verification/judge-harness/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/judge-harness.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

Verification is executable and low stakes; no model judge or calibration set exists.

- do_not_use_when: verification is fully executable, so an Executable Analog or Comparator can decide it without an LLM (holds). Evidence: artifact/workflow.md:3-16: Verification is executable and low stakes; no model judge or calibration set exists.
- do_not_use_when: the verdict is low leverage and a single-sample judge call is proportionate (holds). Evidence: artifact/workflow.md:3-16: Verification is executable and low stakes; no model judge or calibration set exists.

### Admissibility Gate

[Admissibility Gate](https://verificationdesign.com/patterns/verification/admissibility-gate/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/admissibility-gate.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

The generated function has a directly executable correctness check; no model approval is needed.

- do_not_use_when: a named Comparator or Executable Analog can decide the check directly (holds). Evidence: artifact/workflow.md:3-16: The generated function has a directly executable correctness check; no model approval is needed.

### Cross-Family

[Cross-Family](https://verificationdesign.com/patterns/orchestration/cross-family/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/cross-family.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

No model judge evaluates the result; the local assertion decides it.

- do_not_use_when: verification is fully executable, so an Executable Analog or Comparator can decide it without an LLM judge (holds). Evidence: artifact/workflow.md:3-16: No model judge evaluates the result; the local assertion decides it.
- do_not_use_when: the verification is low leverage and misattribution cost is negligible (holds). Evidence: artifact/workflow.md:3-16: No model judge evaluates the result; the local assertion decides it.

### Adversary

[Adversary](https://verificationdesign.com/patterns/orchestration/adversary/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/adversary.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

The executable comparison decides the property without a critic role.

- do_not_use_when: the task is trivial and a second role would add process noise (holds). Evidence: artifact/workflow.md:3-16: The executable comparison decides the property without a critic role.
- do_not_use_when: an Executable Analog or Comparator can decide the property without an LLM critic (holds). Evidence: artifact/workflow.md:3-16: The executable comparison decides the property without a critic role.

### Debate

[Debate](https://verificationdesign.com/patterns/orchestration/debate/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/debate.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

The executable comparison decides the property without rounds or votes.

- do_not_use_when: an Executable Analog or Comparator can decide the property directly (holds). Evidence: artifact/workflow.md:3-16: The executable comparison decides the property without rounds or votes.
- do_not_use_when: token, latency, or provider cost cannot support multiple turns (holds). Evidence: artifact/workflow.md:3-16: The executable comparison decides the property without rounds or votes.

### Escalation Chain

[Escalation Chain](https://verificationdesign.com/patterns/orchestration/escalation-chain/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/escalation-chain.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

A failed check stops the local run; no handler hierarchy or automatic routing exists.

- do_not_use_when: a flat single-handler design is enough (holds). Evidence: artifact/workflow.md:3-16: A failed check stops the local run; no handler hierarchy or automatic routing exists.
- do_not_use_when: an Executable Analog or Comparator can decide the property without routing (holds). Evidence: artifact/workflow.md:3-16: A failed check stops the local run; no handler hierarchy or automatic routing exists.

### Backpressure

[Backpressure](https://verificationdesign.com/patterns/orchestration/backpressure/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/backpressure.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

The one-shot generator cannot consume check feedback; no revision loop is requested.

- do_not_use_when: the upstream step cannot consume feedback (holds). Evidence: artifact/workflow.md:3-16: The one-shot generator cannot consume check feedback; no revision loop is requested.

### Tool Adapter

[Tool Adapter](https://verificationdesign.com/patterns/orchestration/tool-adapter/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/tool-adapter.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

No model-produced tool arguments cross a boundary; the function is called internally.

- do_not_use_when: the call is fully internal and no model output crosses the boundary. (holds). Evidence: artifact/workflow.md:3-16: No model-produced tool arguments cross a boundary; the function is called internally.

## Not verified

None in the judgment record.

Unavailable source text: paste any unavailable JSON results here; source availability was not verified by this renderer.
