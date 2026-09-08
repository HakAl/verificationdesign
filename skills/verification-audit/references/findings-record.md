# Findings record

Write one JSON object with `corpus_revision` equal to the packaged revision,
non-empty `artifact`, a one-line non-empty `scope`, and a `checks` list.
For every bullet in principles-checklist.md, create exactly one entry with the whole
bullet text (including the citation, excluding `- `) as `question`, and its heading's
integer `principle` (1 to 9). Checklist order is preferred; the renderer restores it.

Every entry has `status`, non-empty string `evidence`, and `severity`:

- `sound`: evidence of the checked behavior; severity null.
- `defect`: artifact evidence; failure equal to a catalog failure string or `unmapped`;
  severity high, medium or low. `unmapped` requires non-empty `failure_note`.
- `not-checked`: evidence is the reason no check was performed; severity null.
- `insufficient-evidence`: evidence names what is missing and what would settle it;
  severity null. Include unavailable source URL and reason here when relevant.

Non-defect entries may use null `failure` and empty `failure_note`. Additional defects
outside the checklist use `free: true`, a principle 1 to 9, and an original question.
A free entry never substitutes for a checklist question. Do not put fix proposals in
questions, evidence or notes. The six mapped failure strings are routing aids, not an
exhaustive taxonomy: an unmapped defect is valid.

Validation rules: `structure`, `coverage`, `status`, `evidence`, `failure`, `severity`.
Failure output is a JSON list with `card` (null), `check` (index or null), `rule`, `message`.
The router adds `cards` and `routed` only to defects; it discards previous routing and
recomputes from the snapshot. The renderer rejects mismatched or missing routing.

## Filled example

This complete illustrative record describes a hypothetical self-review workflow.
It is a schema example, not evidence about the operator's artifact.

```json
{
  "corpus_revision": "e632a86b2ca8fbb7f83b3130ba083784c7817667",
  "artifact": "skills/fixtures/audit-known-defect/artifact",
  "scope": "Check generator/verifier independence in the inventory summary workflow.",
  "checks": [
    {
      "principle": 1,
      "question": "What external observation, distinct from the generator saying done, records completion? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#1-external-signals-over-self-review)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 1,
      "question": "Which expected and observed values are recorded for each completion check? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#1-external-signals-over-self-review)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 2,
      "question": "Who evaluates the generated output, and what evidence separates that evaluator from the generator? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#2-independence-between-generation-and-verification)",
      "status": "defect",
      "evidence": "artifact/workflow.md:3-4 names the same generating agent and context for review; artifact/generate.py:5-10 reports completion from its own text without an independent source.",
      "failure": "The agent reviews itself and misses obvious problems.",
      "failure_note": "",
      "severity": "high"
    },
    {
      "principle": 2,
      "question": "Which generator context is withheld from the verifier, and where is that boundary recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#2-independence-between-generation-and-verification)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 3,
      "question": "Which intermediate steps emit observable signals before the final completion decision? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#3-step-level-checkpoints)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 3,
      "question": "Where are a failed checkpoint and the resulting stop or escalation recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#3-step-level-checkpoints)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 4,
      "question": "Which checks search for a counterexample to completion, with the observed result recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#4-adversarial-framing)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 4,
      "question": "What evidence shows that a failing artifact can be rejected by the verification procedure? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#4-adversarial-framing)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 5,
      "question": "Where are the expected conditions and criterion identifiers specified before evaluation? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#5-explicit-criteria)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 5,
      "question": "How does the artifact record the criteria version used for each verdict? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#5-explicit-criteria)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 6,
      "question": "Which claims are checked by executable assertions or comparisons, and where are their results? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#6-executable-verification-is-king)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 6,
      "question": "Which claims still depend on judgment, and what evidence bounds those claims? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#6-executable-verification-is-king)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 7,
      "question": "When model review is used, what generator and verifier model families are recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#7-cross-family-beats-self-verification)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 7,
      "question": "What evidence supports the selected verifier for this artifact and scope? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#7-cross-family-beats-self-verification)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 8,
      "question": "When independent reviewers disagree, where are their claims and evidence recorded separately? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#8-simulate-debate)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 8,
      "question": "What explicit rule routes unresolved disagreement or stops further review? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#8-simulate-debate)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 9,
      "question": "What before-state or isolated baseline lets a check attribute its observation to this run? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#9-isolate-verification-from-ambient-state)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    },
    {
      "principle": 9,
      "question": "Where are run identifiers, state changes and observed deltas recorded? [Principles](https://raw.githubusercontent.com/verificationdesign/verificationdesign/e632a86b2ca8fbb7f83b3130ba083784c7817667/verification_design.md#9-isolate-verification-from-ambient-state)",
      "status": "not-checked",
      "evidence": "Not checked: this fixture isolates generator/verifier independence; no other check was performed.",
      "failure": null,
      "failure_note": "",
      "severity": null
    }
  ]
}
```
