---
name: verification-design
description: Design a verification plan for work being built, using the verificationdesign.com pattern catalog at a pinned revision. Needs a scope line. Do not run without an explicit request.
license: MIT
compatibility: Python 3.11 or later, standard library only. Explicit-only invocation verified on Claude Code 2.1.263 (.claude/skills) and Codex CLI 0.153.4 (.agents/skills, ~/.agents/skills) on 2026-09-08. Other hosts untested and may model-activate this skill.
disable-model-invocation: true
metadata:
  disable-model-invocation: "true"
  version: "1.0.0"
  corpus-revision: "e632a86b2ca8fbb7f83b3130ba083784c7817667"
  corpus-tag: "corpus/v1.0.0"
  catalog-sha256: "b1d737c5ea62e18fc276b8efe64d963e1326c7f93c8b2e639515ed2583ce2d3f"
  principles-sha256: "03033f7084e8fee60e5f7fff7249238af9f375942ad856d4cf485d22d68bf61a"
---

# Verification design

## Purpose

Design a verification plan from recorded applicability judgments and a pinned catalog. Scripts check the record and render the plan; the operator reviews the judgments.

## When not to use

Do not run without an explicit request for this skill. Do not proceed without a resolved scope. For an existing artifact that needs findings, use the audit skill only if the operator requests it.

## Inputs

- Artifact: default is the current working tree. Override: a path or URL given as the
  invocation argument or named in the conversation. Never asked for.
- Scope: one line naming the part or behavior in question. Taken from the invocation
  argument text or from the conversation if the operator already said it. If neither
  supplies it, ask exactly one question and stop until answered. Never guess scope.
- Both resolved values are echoed at the top of the output.

## Procedure

Run commands from this skill directory, with absolute paths for operator-visible records and outputs outside it. Python 3.11 or later is required. No command prompts interactively.

1. Resolve artifact and scope by the rules above. No script runs until scope is resolved.
2. Verify the packaged dependency:

   ```bash
   python3 scripts/load_catalog.py --check
   ```

3. Characterize what is generated, by whom, the completion signal, and where the
   generator would review itself. Read `assets/catalog.json` and
   [judgment-record.md](references/judgment-record.md).
   Write the JSON record to an operator-visible file, one entry per catalog card.
   Copy every `use_when` and `do_not_use_when` condition verbatim in catalog order;
   record a verdict and artifact evidence for each. `unknown` is allowed and must
   surface in the output. An unknown exclusion blocks `apply`. This is a judgment
   step, not an executable inference from prose.
4. Validate; correct record errors and rerun until exit 0. Stop and report a blocked
   dependency if the snapshot fails, rather than rewriting the pin.

   ```bash
   python3 scripts/validate_judgments.py /absolute/path/record.json
   ```

5. Render the validated record:

   ```bash
   python3 scripts/render_plan.py /absolute/path/record.json --output /absolute/path/plan.md
   ```

6. Complete the closing checklist, including any unavailable source text in the
   plan's Not verified section. Do not describe the generated plan as substantively
   verified merely because the record passed.

Source text is optional. If a question needs prose beyond the structured catalog,
retrieve it only through this command (replace `principles` with a catalog card id
for card text):

```bash
python3 scripts/load_catalog.py fetch principles --offline
```

Omit `--offline` only when source retrieval is wanted and network is available.
When `load_catalog.py fetch` reports unavailable, continue on the structured fields
and let the uncertainty section carry its URL and reason. Paste the unavailable JSON into Not verified.

## Available scripts

- `scripts/load_catalog.py`: verify the packaged snapshot, fetch pinned source text, or report drift without switching catalogs.
- `scripts/validate_judgments.py`: check coverage, evidence fields and applicability decisions.
- `scripts/render_plan.py`: validate and render a plan in catalog reading order.

## Output

Use [output-format.md](references/output-format.md) and [the template](assets/plan-template.md). Every script supports `--help`; stdout is JSON, including a `text` envelope for
source text or markdown when `--output -` is used. `--output FILE` writes the document
and prints a JSON destination receipt. Exit codes: 0 ok, 2 usage, 3 validation failed,
4 unavailable, 5 internal. Do not overwrite the input record with an output path.

## Limitations

Offline means catalog-only operation: intent, conditions, determinism moves,
observable signals and the failure map remain available, but source prose does not.
Set `VERIFICATION_SKILLS_OFFLINE=1` or use `--offline` to prevent retrieval and drift
requests. Nothing is cached. An optional drift report never changes the loaded pin.
The validators check recorded judgments, not their truth or the completeness of the
underlying evidence. Substantive conclusions require operator review.

Explicit-only activation was observed on Claude Code 2.1.263 in `.claude/skills` and
Codex CLI 0.153.4 in `.agents/skills` and `~/.agents/skills` on 2026-09-08. Other hosts
are untested and may model-activate this skill. SKILL.md is an ordinary readable file;
invocation controls do not prevent a model from opening it as a file.

## Closing checklist

- Artifact and scope echoed; scope came from the operator, not a guess.
- Snapshot check and record validator exited 0; every required condition or question covered.
- Every citation identifies the human URL, pinned source URL and corpus revision.
- Unknown judgments and unavailable evidence remain visible.
- Output rendered to the requested file and substantive judgments left for operator review.
