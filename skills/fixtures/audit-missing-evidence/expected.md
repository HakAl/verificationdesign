# Verification findings

Artifact: skills/fixtures/audit-missing-evidence/artifact

Scope: Audit the deployed nightly inventory summarizer and its verification behavior.

Corpus revision: `e632a86b2ca8fbb7f83b3130ba083784c7817667`

Corpus tag: `corpus/v1.0.0`

## Defects

None.

## Checked and sound

None.

## Not checked

None.

## Insufficient evidence

### Principle 1

What external observation, distinct from the generator saying done, records completion? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#1-external-signals-over-self-review)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 1

Which expected and observed values are recorded for each completion check? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#1-external-signals-over-self-review)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 2

Who evaluates the generated output, and what evidence separates that evaluator from the generator? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#2-independence-between-generation-and-verification)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 2

Which generator context is withheld from the verifier, and where is that boundary recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#2-independence-between-generation-and-verification)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 3

Which intermediate steps emit observable signals before the final completion decision? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#3-step-level-checkpoints)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 3

Where are a failed checkpoint and the resulting stop or escalation recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#3-step-level-checkpoints)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 4

Which checks search for a counterexample to completion, with the observed result recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#4-adversarial-framing)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 4

What evidence shows that a failing artifact can be rejected by the verification procedure? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#4-adversarial-framing)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 5

Where are the expected conditions and criterion identifiers specified before evaluation? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#5-explicit-criteria)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 5

How does the artifact record the criteria version used for each verdict? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#5-explicit-criteria)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 6

Which claims are checked by executable assertions or comparisons, and where are their results? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#6-executable-verification-is-king)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 6

Which claims still depend on judgment, and what evidence bounds those claims? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#6-executable-verification-is-king)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 7

When model review is used, what generator and verifier model families are recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#7-cross-family-beats-self-verification)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 7

What evidence supports the selected verifier for this artifact and scope? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#7-cross-family-beats-self-verification)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 8

When independent reviewers disagree, where are their claims and evidence recorded separately? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#8-simulate-debate)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 8

What explicit rule routes unresolved disagreement or stops further review? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#8-simulate-debate)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 9

What before-state or isolated baseline lets a check attribute its observation to this run? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#9-isolate-verification-from-ambient-state)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.

### Principle 9

Where are run identifiers, state changes and observed deltas recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#9-isolate-verification-from-ambient-state)

Evidence: artifact/workflow.md:3-5 describes deployed behavior but supplies no run evidence. A deployed run trace, the checker implementation and its expected/observed results would settle this question.
