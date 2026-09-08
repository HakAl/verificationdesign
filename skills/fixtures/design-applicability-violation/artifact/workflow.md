# Local arithmetic check design

An agent generates one pure Python function returning the square of an integer.
Generation is a single-shot step with no model tool calls or automatic revision.
The specification is exact: square(7) is 49, and square(-3) is 9.
An existing local assertion harness will extract the integer result and compare it
with the expected integer using equality, on every regression run.
Completion is the harness exit code, never the generator's opinion.
The check is cheap, deterministic and exact; there is no subjective property.
No shared state, asynchronous event surface, tool boundary or lifecycle hook exists.
Only this private function return is in scope; no persistent artifact is the check target.
There is no model reviewer, critic, debate, calibration set or handler hierarchy.
A failed comparison stops the local run; no retry or feedback is consumed.
This is a low-stakes local exercise, with no promotion, deployment or external action.
There is no audit report consumer, prompt rubric, criteria drift, or cross-run failure analysis.
No human review step is part of this workflow; the two assertions are the whole check.

For this variant, adapting the general Comparator costs more than one-off human review.
The Comparator exclusion is explicitly part of this hypothetical design.
