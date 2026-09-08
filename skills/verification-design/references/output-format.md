# Verification plan output

The renderer writes markdown with artifact, scope, corpus revision and tag at the top.
Use [the template](../assets/plan-template.md) as the section contract.

Patterns applied name the card, human URL, pinned source URL and revision, the
holding use_when conditions with artifact evidence, observable-signal bullets and the
determinism move. Patterns rejected name the holding exclusion and evidence, or every
non-holding use_when when none applies. Both sections follow catalog reading order.
Not verified includes every undecided card and every unknown condition, even if its
card is rejected. It always includes the fixed source-availability line for the agent
to append unavailable JSON. An empty list means no unknowns in the record, not proof
that source text was fetched or judgments were correct.

## Shape example

```markdown
# Verification plan

Artifact: {artifact}

Scope: {scope}

Corpus revision: `{corpus_revision}`

Corpus tag: `{corpus_tag}`

## Workflow characterization

{workflow_characterization}

## Patterns applied

{patterns_applied}

## Patterns rejected

{patterns_rejected}

## Not verified

{not_verified}
```

`--output FILE` writes markdown and emits a JSON receipt. `--output -` emits
`{"text": "<the rendered markdown>"}` on stdout, preserving the structured-output
contract. Source retrieval uses the same text envelope. Validators and routing emit
JSON directly. All file outputs use UTF-8 and LF, and reruns are byte-stable.
