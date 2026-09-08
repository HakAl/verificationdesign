# Verification findings

Artifact: skills/fixtures/audit-known-defect/artifact

Scope: Check generator/verifier independence in the inventory summary workflow.

Corpus revision: `e632a86b2ca8fbb7f83b3130ba083784c7817667`

Corpus tag: `corpus/v1.0.0`

## Defects

### Principle 2

Who evaluates the generated output, and what evidence separates that evaluator from the generator? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#2-independence-between-generation-and-verification)

Evidence: artifact/workflow.md:3-4 names the same generating agent and context for review; artifact/generate.py:5-10 reports completion from its own text without an independent source.

Severity: high

Failure: The agent reviews itself and misses obvious problems.

- [Blind Oracle](https://verificationdesign.com/patterns/verification/blind-oracle/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/blind-oracle.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`
- [Cross-Family](https://verificationdesign.com/patterns/orchestration/cross-family/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/cross-family.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`
- [Adversary](https://verificationdesign.com/patterns/orchestration/adversary/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/adversary.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`
- [Admissibility Gate](https://verificationdesign.com/patterns/verification/admissibility-gate/); [pinned source](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/ai-design-patterns/cards/admissibility-gate.md); revision `e632a86b2ca8fbb7f83b3130ba083784c7817667`

## Checked and sound

None.

## Not checked

### Principle 1

What external observation, distinct from the generator saying done, records completion? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#1-external-signals-over-self-review)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 1

Which expected and observed values are recorded for each completion check? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#1-external-signals-over-self-review)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 2

Which generator context is withheld from the verifier, and where is that boundary recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#2-independence-between-generation-and-verification)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 3

Which intermediate steps emit observable signals before the final completion decision? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#3-step-level-checkpoints)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 3

Where are a failed checkpoint and the resulting stop or escalation recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#3-step-level-checkpoints)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 4

Which checks search for a counterexample to completion, with the observed result recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#4-adversarial-framing)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 4

What evidence shows that a failing artifact can be rejected by the verification procedure? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#4-adversarial-framing)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 5

Where are the expected conditions and criterion identifiers specified before evaluation? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#5-explicit-criteria)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 5

How does the artifact record the criteria version used for each verdict? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#5-explicit-criteria)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 6

Which claims are checked by executable assertions or comparisons, and where are their results? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#6-executable-verification-is-king)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 6

Which claims still depend on judgment, and what evidence bounds those claims? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#6-executable-verification-is-king)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 7

When model review is used, what generator and verifier model families are recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#7-cross-family-beats-self-verification)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 7

What evidence supports the selected verifier for this artifact and scope? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#7-cross-family-beats-self-verification)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 8

When independent reviewers disagree, where are their claims and evidence recorded separately? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#8-simulate-debate)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 8

What explicit rule routes unresolved disagreement or stops further review? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#8-simulate-debate)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 9

What before-state or isolated baseline lets a check attribute its observation to this run? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#9-isolate-verification-from-ambient-state)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

### Principle 9

Where are run identifiers, state changes and observed deltas recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#9-isolate-verification-from-ambient-state)

Evidence: Not checked: this fixture isolates generator/verifier independence; no other check was performed.

## Insufficient evidence

None.
