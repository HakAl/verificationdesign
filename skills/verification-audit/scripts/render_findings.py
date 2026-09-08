#!/usr/bin/env python3
"""Render validated, routed findings without generating fix proposals."""
import sys
sys.dont_write_bytecode = True
from load_catalog import cli_main, emit, load_catalog, parser, read_record, write_text
from route_failures import route
from validate_findings import checklist, validate


def render(record, catalog, meta):
    lines = ["# Verification findings", "", f'Artifact: {record["artifact"]}', "",
             f'Scope: {record["scope"]}', "", f'Corpus revision: `{catalog["revision"]}`', "",
             f'Corpus tag: `{meta["corpus-tag"]}`', ""]
    order = {q: i for i, (_, q) in enumerate(checklist())}
    checks = sorted(record["checks"], key=lambda c: (c["principle"], order.get(c["question"], len(order)), c["question"]))
    for heading, status in (("Defects", "defect"), ("Checked and sound", "sound"), ("Not checked", "not-checked"), ("Insufficient evidence", "insufficient-evidence")):
        lines += ["## " + heading, ""]
        selected = [c for c in checks if c["status"] == status]
        if not selected:
            lines += ["None.", ""]
        for check in selected:
            lines += [f'### Principle {check["principle"]}', "", check["question"], "", "Evidence: " + check["evidence"], ""]
            if status == "defect":
                lines += ["Severity: " + check["severity"], "", "Failure: " + check["failure"], ""]
                if check["failure"] == "unmapped":
                    lines += ["Failure note: " + check["failure_note"], ""]
                if not check["cards"]:
                    lines += ["no routed card", ""]
                else:
                    lines += [f'- [{c["title"]}]({c["html_url"]}); [pinned source]({c["source_url"]}); revision `{catalog["revision"]}`' for c in check["cards"]] + [""]
    return "\n".join(lines)


def main():
    p = parser(__doc__, "python3 scripts/render_findings.py routed.json --output findings.md")
    p.add_argument("record", help="routed JSON findings record")
    p.add_argument("--output", default="-", metavar="FILE|-", help="markdown file; - emits a JSON text envelope")
    args = p.parse_args()
    record = read_record(args.record)
    catalog, meta = load_catalog()
    errors = validate(record, catalog)
    if errors:
        emit(errors)
        return 3
    if route(record, catalog) != record:
        emit([{"card": None, "rule": "routing", "message": "routed record must match the pinned failure map; run route_failures.py"}])
        return 3
    write_text(render(record, catalog, meta), args.output)
    return 0


if __name__ == "__main__":
    sys.exit(cli_main(main))
