# Evidence Synthesis by Claim

This additive accumulator gathers reviewed evidence under claims rather than sources. It has no authority over `verification_design.md` and does not modify or replace canonical material. Status describes the evidence currently recorded here; it does not prescribe action. Claims remain scoped to the settings described in their reviewed notes.

Section headings are filing locations for new evidence, not commentary on the principles they mirror. A principle's own supporting evidence lives in `verification_design.md`; a claim filed under a section sits beneath that principle and neither supports nor qualifies it. An empty section means that principle has no unfolded evidence here, not that it is unsupported.

Seeded: 2026-08-19
Header clarified: 2026-08-23

## 1. External Signals Over Self-Review

No claims recorded yet.

## 2. Independence Between Generation and Verification

### Agent authorization can separate probabilistic interpretation or action proposal from a deterministic runtime decision, conditional on the completeness of the decision evidence and mediation boundary.

Status: corroborated
Also bears on: Principle 9

Evidence:
- arXiv:2607.27267, grade C, FAVA lowers an LLM-derived permission representation into a graph for an SMT-backed decision before effectful actions in authored benchmark cases.
- arXiv:2606.22916, grade C, IGAC places a certificate-based server-side gateway between an untrusted model proposal and the action pipeline in synthetic runtime tasks.

Tension: The studies use different authorization representations and deterministic mechanisms, but both depend on author-specified semantic bounds and complete mediation that their evaluations do not independently establish.
What would move this: An independent evaluation using naturally occurring requests and effects, with measured extraction errors and executable mediation-bypass probes, would change the evidence description.

## 3. Step-Level Checkpoints

### Under a declared stochastic objective and cost proxy, oversight checkpoints can be scheduled as an executable budget-allocation problem.

Status: single-source

Evidence:
- arXiv:2607.16530, grade C, a discrete algorithm globally minimizes the paper's oversight objective under stated assumptions and exposes review count, stage indices, gap sequence, proxy cost, and computed loss.

Tension: The experiments use model-simulated reviewers, and stage or artifact-length cost proxies do not measure human attention, fatigue, interruption cost, or review time.
What would move this: A different group testing checkpoint schedules with measured human review time or cognitive cost, plus sensitivity analysis for stage-dependent error growth, would change the Status.

## 4. Adversarial Framing

### Assigning untrusted candidate text a lower-authority chat role does not reliably quarantine prompt injection against an LLM judge.

Status: single-source
Also bears on: Principle 7

Evidence:
- arXiv:2605.30521, grade B, mock-tool-result wrapping failed to consistently reduce attack success and often worsened it across the paper's tested judge models and tasks.

What would move this: Replication on different judge families and task datasets, with executable controls that isolate role placement from prompt formatting, would change the Status.

## 5. Explicit Criteria

### Explicit rubrics remain sensitive to how criteria are presented and executed.

Status: corroborated
Also bears on: Principle 7

Evidence:
- arXiv:2602.02219, grade B, randomized rubric option and criterion ordering changed judgments and altered the selected best response on 16% to 39% of prompts in the tested rubric-judging setup.
- arXiv:2606.29920, grade B, per-rubric verification accuracy varied by task, category, prompt, and batching, with batching losses becoming steep on long agent trajectories.

Tension: One study manipulates presentation order while the other measures rubric execution and batching, so they agree on instability without identifying one shared mechanism.
What would move this: Independent evaluation combining balanced presentation permutations with per-rubric reliability measurements on deployed agent trajectories would change the evidence description.

### Model-generated criteria can improve externally anchored benchmark outcomes while leaving criteria provenance model-internal during refinement.

Status: single-source

Evidence:
- arXiv:2605.30568, grade C, one model generated rubrics and another selected among them without human labels inside the refinement loop, while final performance was evaluated against benchmarks with human annotations.

Tension: The external benchmark anchor makes the reported outcome interpretable, but an annotation-scarce deployment may not supply an equivalent anchor.
What would move this: A different group comparing generated and expert-authored criteria on a dataset with withheld human annotations would change the Status.

## 6. Executable Verification Is King

### Partially verifiable tasks can route individual criteria to deterministic checkers or semantic judges instead of using one checker for the whole task.

Status: single-source
Also bears on: Principle 5

Evidence:
- arXiv:2605.30244, grade C, a vision-language reinforcement-learning study extracted rubric criteria, deterministically checked verifiable ones, judged fuzzy ones, and hid answer-bearing information from checkers.

Tension: The evidence comes from one reinforcement-learning setting, and ordinary-response accuracy did not expose the same exploitable false positives as constructed failure cases.
What would move this: Independent criterion-routing results on non-vision agent tasks, with executable failure-case audits and checker information-ablation tests, would change the Status.

### A deterministic or automated gate can satisfy its surface metric while missing the failure class it is meant to detect.

Status: single-source
Also bears on: Principle 1

Evidence:
- arXiv:2111.09525, grade B, a reviewed cluster of summarization-faithfulness evaluations found that overlap, entailment, question-answering, and generated-reference checks have documented blind spots and can reward unsupported summaries.

Tension: This pre-LLM-judge source cluster supports a general validity distinction, but it does not directly test current agent-verification gates.
What would move this: Independent modern evaluation that injects known failures into an agent or LLM-judge workflow and measures which passing gates detect them would change the Status.

## 7. Cross-Family Beats Self-Verification

### Candidate-aware cross-family judges can share exploitable false-positive basins when their judgments track plausibility rather than correctness.

Status: single-source

Evidence:
- arXiv:2607.05904, grade B, optimization exploited reference-based judges in tested low-accuracy regimes, while candidate-independent blind-solve signals reduced the shared reward-hacking channel.

Tension: Low organic cross-judge error overlap reported in arXiv:2606.29920 suggests that optimization-induced candidates and ordinary rubric-verification errors may have different correlation structures.
What would move this: A different group comparing candidate-aware and candidate-independent judges across both optimized adversarial outputs and ordinary trajectories would change the Status.

### Tightening judge criteria can change abstention behavior without improving discrimination.

Status: single-source

Evidence:
- arXiv:2606.15610, grade C, a judge-datasheet protocol found that criterion changes could suppress false preferences by increasing abstention rather than improving discrimination.

Tension: The authors present the result as measurement groundwork rather than evidence of broad downstream effects.
What would move this: Ecological replication on deployed evaluation tasks that separately reports discrimination, abstention, and coverage would change the Status.

## 8. Simulate Debate

No claims recorded yet.

## 9. Isolate Verification from Ambient State

### Operator-facing approval, cancellation, timeout, and authorization controls govern external effects only when the enforcement path completely mediates those effects.

Status: corroborated
Also bears on: Principle 2

Evidence:
- arXiv:2607.14166, grade B, deterministic probes across pinned agent frameworks reproduced cases where a control-flow primitive paused or terminated one path while a related external effect still committed.
- arXiv:2607.27267, grade C, a permission-graph solver can decide over represented evidence, while missed labels, sinks, dependencies, or gateway bypasses remain outside its guarantee.
- arXiv:2606.22916, grade C, certificate-based narrowing constrains proposed calls only under correct effect bounds, gateway logic, and complete mediation.

Tension: The framework probes directly exercise shipped control primitives, while the authorization papers evaluate authored prototypes and synthetic cases; none establishes complete mediation in production deployments.
What would move this: Independent end-to-end probes that compare each control decision with realized external effects across framework-local and structural enforcement boundaries would change the evidence description.

### Task-completion context can alter an agent's permission decisions even when the permission dialog is held fixed.

Status: single-source
Also bears on: Principle 4

Evidence:
- arXiv:2608.04755, grade C, controlled fixed-popup comparisons found task-context-conditioned permission grants and showed that some prompt mitigations lowered wrongful grants by also suppressing legitimate grants.

Tension: The dialogs and application distribution were narrow, and separation of task execution from authorization remains unevaluated.
What would move this: Independent replication using naturally triggered dialogs, more applications and permission types, and joint legitimate-grant and wrongful-grant measurements would change the Status.

## Unassigned

### Human involvement in a verification or decision workflow does not by itself establish scrutiny or uptake of available evidence.

Status: corroborated

Evidence:
- DOI:10.1177/0018720810376055, grade B, a systematic review of human automation studies found automation bias and omission or commission errors across decision-support settings, with accountability among the reported mitigations.
- arXiv:2512.01241, grade C, an abstract-only medical study reported that AI-assisted physicians omitted valuable recommendations and that omission accounted for more than 80% of severe errors in its consultation setting.

Tension: The systematic review predates current LLM workflows, while the medical preprint does not expose arm denominators or distinguish inattention from disagreement, workflow friction, or justified rejection.
What would move this: Observable attention and uptake measures in an LLM workflow, with controls separating non-attention from deliberate rejection, would change the Status and clarify whether the claim attaches to Principle 1 or Principle 3.

### Returning content to its human source is the closest qualitative-research analog to source-based fidelity checking, but its efficacy is contested.

Status: single-source

Evidence:
- DOI:10.1177/1049732316654870, grade B, a critical review of member checking describes several forms of returning findings to participants and records conflicting views about validity benefits, epistemic fit, burden, and possible distortion.

Tension: The reviewed literature does not support treating participant confirmation as reliable positive fidelity evidence, and qualitative member checking is not an agent-verification experiment.
What would move this: A controlled study that defines fidelity independently and compares source confirmation with other verification signals would change the Status and clarify whether the claim attaches to Principle 1.
