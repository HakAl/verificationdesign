# Script fixtures

These fixtures exercise deterministic record validation, failure routing and rendering.
They do not establish the truth of agent judgments or replace blind host tests.

- `design-sound`: two applied cards, complete 17-card coverage, no unknowns, and rejections including one for absent applicability.
- `design-applicability-violation`: a holding exclusion rejects Comparator; five negatives isolate exclusion, absent applicability, unknown exclusion, missing condition and reordered condition failures.
- `audit-known-defect`: one self-review defect under principle 2, routed via the failure map.
- `audit-missing-evidence`: unavailable deployed behavior stays insufficient-evidence; a sound claim without evidence fails.

Each directory contains a small raw artifact, a filled record and expected markdown.
Negative records have a sibling expected JSON file with `exit_code` and exact `rules`.
The checker validates all four positive records, compares all rendered bytes and checks all six negatives.
