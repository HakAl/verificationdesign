# Changelog

## skills/v1.1.0 (2026-09-08)

Pins unchanged `corpus/v1.0.0`. Required `assumptions` means v1.0.0 records do not
validate unchanged; design requires a verification-path entry. Optional additions:
measurements, artifact_identity, unavailable_sources, design instantiation and priority.
Audit adds not-applicable and free out-of-scope observations, with shared-cause notes.

New scaffold and citation-check scripts copy fields and check citation bounds without
judging evidence. A Python 3.11 guard rejects unsupported runtimes before work and
`--check` reports the interpreter version. Principle 4's second checklist question now
explicitly asks for evidence recorded in the artifact; old audit records must also update
that copied question. Rendering adds summaries,
assumptions, measurements, six audit sections, reference-style Sources, reason/evidence
labels and bullet self-review points. Records and outputs belong in a visible dated
directory, never system temp storage or the skill directory.

## skills/v1.0.0 (2026-09-08)

Source: corpus/v1.0.0 at `e632a86b2ca8fbb7f83b3130ba083784c7817667`.
Initial verification-design and verification-audit skills, with explicit invocation
controls, packaged catalog snapshots, record validators, deterministic renderers,
failure routing and offline fixture and retrieval checks.
