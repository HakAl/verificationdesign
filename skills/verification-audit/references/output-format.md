# Verification findings output

The renderer writes markdown with artifact, scope, corpus revision and tag at the top.
Use [the template](../assets/findings-template.md) as the section contract.

All four sections remain present even when empty (written as `None.`). Defects name
the principle, question, evidence, failure, severity and routed cards. Every routed
card carries its human URL, pinned source URL and corpus revision. An unmapped defect
shows its failure_note and `no routed card`. Sound checks include evidence; the last
two sections explain what was not checked or what evidence would settle the question.
Order is principle number then checklist order, with free entries sorted by question.
No fix proposals are generated or requested anywhere in this output.

## Shape example

```markdown
# Verification findings

Artifact: {artifact}

Scope: {scope}

Corpus revision: `{corpus_revision}`

Corpus tag: `{corpus_tag}`

## Defects

{defects}

## Checked and sound

{checked_and_sound}

## Not checked

{not_checked}

## Insufficient evidence

{insufficient_evidence}
```

`--output FILE` writes markdown and emits a JSON receipt. `--output -` emits
`{"text": "<the rendered markdown>"}` on stdout, preserving the structured-output
contract. Source retrieval uses the same text envelope. Validators and routing emit
JSON directly. All file outputs use UTF-8 and LF, and reruns are byte-stable.
