#!/usr/bin/env python3
"""Render a verification plan from a valid applicability record."""
import sys
sys.dont_write_bytecode = True
from load_catalog import cli_main, emit, load_catalog, parser, read_record, write_text
from validate_judgments import validate


def citation(card, revision):
    return f'[{card["title"]}]({card["html_url"]}); [pinned source]({card["source_url"]}); revision `{revision}`'


def render(record, catalog, meta):
    lines = ["# Verification plan", "", f'Artifact: {record["artifact"]}', "",
             f'Scope: {record["scope"]}', "", f'Corpus revision: `{catalog["revision"]}`', "",
             f'Corpus tag: `{meta["corpus-tag"]}`', "", "## Workflow characterization", ""]
    workflow = record["workflow"]
    for key, title in (("generated", "Generated"), ("generator", "Generator"), ("completion_signal", "Completion signal")):
        lines += [f'{title}: {workflow[key]}', ""]
    lines += ["Self-review points: " + ("; ".join(workflow["self_review_points"]) or "None recorded."), ""]
    by_id = {c["id"]: c for c in record["cards"]}
    for heading, selection in (("Patterns applied", "apply"), ("Patterns rejected", "reject")):
        lines += ["## " + heading, ""]
        selected = [c for c in catalog["cards"] if by_id[c["id"]]["decision"] == selection]
        if not selected:
            lines += ["None.", ""]
        for card in selected:
            judgment = by_id[card["id"]]
            lines += ["### " + card["title"], "", citation(card, catalog["revision"]), "", judgment["reason"], ""]
            if selection == "apply":
                conditions = [("use_when", c) for c in judgment["use_when"] if c["verdict"] == "holds"]
            else:
                conditions = [("do_not_use_when", c) for c in judgment["do_not_use_when"] if c["verdict"] == "holds"]
                if not conditions:
                    conditions = [("use_when", c) for c in judgment["use_when"]]
            for group, condition in conditions:
                lines += [f'- {group}: {condition["condition"]} ({condition["verdict"]}). Evidence: {condition["evidence"]}']
            lines.append("")
            if selection == "apply":
                lines += ["Observable signals:", ""] + ["- " + s for s in card["observable_signal"]]
                lines += ["", "Determinism move: " + card["determinism_move"], ""]
    lines += ["## Not verified", ""]
    uncertain = False
    for card in catalog["cards"]:
        judgment = by_id[card["id"]]
        unknowns = [(group, c) for group in ("use_when", "do_not_use_when") for c in judgment[group] if c["verdict"] == "unknown"]
        if judgment["decision"] == "undecided" or unknowns:
            uncertain = True
            lines += ["### " + card["title"], "", citation(card, catalog["revision"]), "", "Decision: " + judgment["decision"], ""]
            lines += [f'- {group}: {c["condition"]}. Reason: {c["evidence"] or "Not recorded."}' for group, c in unknowns]
            lines.append("")
    if not uncertain:
        lines += ["None in the judgment record.", ""]
    lines += ["Unavailable source text: paste any unavailable JSON results here; source availability was not verified by this renderer.", ""]
    return "\n".join(lines)


def main():
    p = parser(__doc__, "python3 scripts/render_plan.py record.json --output plan.md")
    p.add_argument("record", help="JSON judgment record")
    p.add_argument("--output", default="-", metavar="FILE|-", help="markdown file; - emits a JSON text envelope")
    args = p.parse_args()
    record = read_record(args.record)
    catalog, meta = load_catalog()
    errors = validate(record, catalog)
    if errors:
        emit(errors)
        return 3
    write_text(render(record, catalog, meta), args.output)
    return 0


if __name__ == "__main__":
    sys.exit(cli_main(main))
