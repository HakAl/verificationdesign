---
name: verification-audit
description: Audit an existing artifact against the nine verification principles and route each defect to catalog cards. Needs a scope line. Do not run without an explicit request.
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

# Verification audit

## Purpose

Audit an existing artifact using nine principles and route recorded defects through a pinned catalog. Scripts validate coverage, evidence fields and routing; the operator assesses substance.

## When not to use

Do not run without an explicit request for this skill. Do not proceed without a resolved scope. This skill reports findings and never proposes fixes. Planning new work belongs to a separately requested design skill.

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

3. Read `assets/catalog.json`, [principles-checklist.md](references/principles-checklist.md) and
   [findings-record.md](references/findings-record.md). Walk every checklist question
   against the artifact. Write the findings record to an operator-visible file, one
   entry per question plus free entries for defects not prompted by the checklist.
   Cite evidence for sound and defect judgments; state the reason or missing evidence
   for not-checked and insufficient-evidence. Record uncertainty rather than inventing
   a defect. This is a judgment step, with no script making the judgments.
4. Validate; correct record errors and rerun until exit 0. If a dependency cannot be
   validated, stop and report it rather than changing the pin.

   ```bash
   python3 scripts/validate_findings.py /absolute/path/record.json
   ```

5. Route the validated defects through the packaged failure map:

   ```bash
   python3 scripts/route_failures.py /absolute/path/record.json --output /absolute/path/routed.json
   ```

6. Render findings:

   ```bash
   python3 scripts/render_findings.py /absolute/path/routed.json --output /absolute/path/findings.md
   ```

7. Complete the closing checklist. No fix proposals anywhere in the output.

Source text is optional. If a question needs prose beyond the structured catalog,
retrieve it only through this command (replace `principles` with a catalog card id
for card text):

```bash
python3 scripts/load_catalog.py fetch principles --offline
```

Omit `--offline` only when source retrieval is wanted and network is available.
When `load_catalog.py fetch` reports unavailable, continue on the structured fields
and let the uncertainty section carry its URL and reason. Mark affected questions insufficient-evidence and include the unavailable JSON and what evidence would settle them before validating and rendering.

## Available scripts

- `scripts/load_catalog.py`: verify the packaged snapshot, fetch pinned source text, or report drift without switching catalogs.
- `scripts/validate_findings.py`: check checklist coverage, evidence and defect fields.
- `scripts/route_failures.py`: attach pinned card citations to recorded defects.
- `scripts/render_findings.py`: validate routing and render four findings sections.

## Output

Use [output-format.md](references/output-format.md) and [the template](assets/findings-template.md). Every script supports `--help`; stdout is JSON, including a `text` envelope for
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
- Defects, Checked and sound, Not checked, and Insufficient evidence sections present; no fix proposals.
