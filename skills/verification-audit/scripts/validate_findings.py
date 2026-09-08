#!/usr/bin/env python3
"""Validate evidence and coverage in a verification findings record."""
from pathlib import Path
import re
import sys
sys.dont_write_bytecode = True
from load_catalog import ROOT, SnapshotError, cli_main, emit, load_catalog, parser, read_record


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def checklist(path=None):
    rows, principle = [], None
    path = Path(path) if path else ROOT / "references" / "principles-checklist.md"
    for line in path.read_text(encoding="utf-8").splitlines():
        heading = re.fullmatch(r"## Principle ([1-9])", line)
        if heading:
            principle = int(heading[1])
        elif line.startswith("- "):
            if principle is None:
                raise SnapshotError("checklist question lacks principle")
            rows.append((principle, line[2:]))
    if any(sum(p == n for p, _ in rows) < 2 for n in range(1, 10)) or len(set(q for _, q in rows)) != len(rows):
        raise SnapshotError("checklist needs unique questions, at least two per principle")
    return rows


def validate(record, catalog=None, questions=None):
    if catalog is None:
        catalog, _ = load_catalog()
    questions = checklist() if questions is None else questions
    errors = []
    def fail(index, rule, message):
        errors.append({"card": None, "check": index, "rule": rule, "message": message})
    if not isinstance(record, dict):
        fail(None, "structure", "record must be an object")
        return errors
    for key in ("corpus_revision", "artifact", "scope"):
        if not nonempty(record.get(key)):
            fail(None, "structure", key + " must be a non-empty string")
    if record.get("corpus_revision") != catalog["revision"]:
        fail(None, "structure", "corpus_revision must equal the snapshot revision")
    if isinstance(record.get("scope"), str) and len(record["scope"].splitlines()) != 1:
        fail(None, "structure", "scope must be one line")
    checks = record.get("checks")
    if not isinstance(checks, list):
        fail(None, "structure", "checks must be a list")
        return errors
    failures = {f["failure"] for f in catalog["failures"]}
    known = dict((q, p) for p, q in questions)
    seen = []
    for i, check in enumerate(checks):
        if not isinstance(check, dict):
            fail(i, "structure", "check must be an object")
            continue
        principle, question = check.get("principle"), check.get("question")
        if type(principle) is not int or principle not in range(1, 10) or not nonempty(question):
            fail(i, "structure", "principle must be 1 to 9 and question must be non-empty")
            continue
        if "free" in check and type(check["free"]) is not bool:
            fail(i, "structure", "free must be a boolean")
        if check.get("free") is True:
            if question in known or check.get("status") != "defect":
                fail(i, "coverage", "free entries must be additional defects with their own question")
        else:
            seen.append(question)
            if known.get(question) != principle:
                fail(i, "coverage", "question must match the checklist and its principle verbatim")
        status = check.get("status")
        if not isinstance(status, str) or status not in {"sound", "defect", "not-checked", "insufficient-evidence"}:
            fail(i, "status", "unsupported status")
        if not nonempty(check.get("evidence")):
            fail(i, "evidence", "every status requires evidence or a reason stating what is missing")
        if status == "defect":
            failure = check.get("failure")
            if not isinstance(failure, str) or failure not in failures | {"unmapped"}:
                fail(i, "failure", "defects require a catalog failure string or unmapped")
            if failure == "unmapped" and not nonempty(check.get("failure_note")):
                fail(i, "failure", "unmapped defects require failure_note")
            if check.get("severity") not in ("high", "medium", "low"):
                fail(i, "severity", "defects require high, medium or low severity")
        elif "severity" not in check or check["severity"] is not None:
            fail(i, "severity", "non-defect severity must be null")
    for _, question in questions:
        if seen.count(question) != 1:
            fail(None, "coverage", "checklist question must appear exactly once: " + question)
    return errors


def main():
    p = parser(__doc__, "python3 scripts/validate_findings.py record.json")
    p.add_argument("record", help="JSON findings record")
    args = p.parse_args()
    record = read_record(args.record)
    errors = validate(record)
    if errors:
        emit(errors)
        print("findings validation failed", file=sys.stderr)
        return 3
    emit({"valid": True, "checks": len(record["checks"]), "defects": sum(c["status"] == "defect" for c in record["checks"])})
    return 0


if __name__ == "__main__":
    sys.exit(cli_main(main))
