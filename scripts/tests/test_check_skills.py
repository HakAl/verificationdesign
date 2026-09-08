"""Mechanical parser, judgment rule, and record boundary checks."""
import copy
import importlib.util
import itertools
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("check_skills", ROOT / "scripts/check_skills.py")
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)
DESIGN = ROOT / "skills/verification-design"
sys.path.insert(0, str(DESIGN / "scripts"))
from validate_judgments import decision, validate


class ParserTests(unittest.TestCase):
    def setUp(self):
        self.text = (DESIGN / "SKILL.md").read_text()
        self.yaml = (DESIGN / "agents/openai.yaml").read_text()

    def test_good_frontmatter_and_host_policy(self):
        self.assertEqual(checker.frontmatter_errors(self.text, DESIGN.name, self.yaml), [])
        parsed = checker.parse_frontmatter(self.text)
        self.assertIs(parsed["disable-model-invocation"], True)
        self.assertEqual(parsed["metadata"]["disable-model-invocation"], "true")

    def test_bad_description(self):
        for phrase in ("use when", "whenever", "automatically", "trigger"):
            with self.subTest(phrase=phrase):
                bad = self.text.replace("Design a verification plan", phrase + " a verification plan")
                self.assertTrue(checker.frontmatter_errors(bad, DESIGN.name, self.yaml))

    def test_missing_explicit_request_sentence(self):
        self.assertTrue(checker.frontmatter_errors(self.text.replace("Do not run without an explicit request.", ""), DESIGN.name, self.yaml))

    def test_wrong_name_and_flag_types(self):
        for old, new in (("name: verification-design", "name: Wrong_Name"), ("disable-model-invocation: true\n", 'disable-model-invocation: "true"\n'), ('  disable-model-invocation: "true"', "  disable-model-invocation: true")):
            with self.subTest(new=new):
                self.assertTrue(checker.frontmatter_errors(self.text.replace(old, new, 1), DESIGN.name, self.yaml))

    def test_bad_yaml_policy(self):
        for value in ("true", '"false"'):
            self.assertTrue(checker.frontmatter_errors(self.text, DESIGN.name, self.yaml.replace("false", value)))

    def test_frontmatter_missing_or_unclosed(self):
        for text in ("name: example\n", "---\nname: example\n"):
            with self.assertRaises(ValueError):
                checker.parse_frontmatter(text)

    def test_yaml_subset_good(self):
        self.assertEqual(checker.parse_yaml_subset('policy:\n  enabled: false\n  text: "true"\nname: example\n'), {"policy": {"enabled": False, "text": "true"}, "name": "example"})

    def test_yaml_subset_rejects_ambiguous_inputs(self):
        for text in ('a: x\na: y\n', '  a: x\n', 'a:\n    b: true\n', 'a: "unterminated\n', 'a: [x]\n', 'a:\n  b:\n'):
            with self.subTest(text=text), self.assertRaises(ValueError):
                checker.parse_yaml_subset(text)

    def test_normalization_crlf(self):
        self.assertEqual(checker.normalize_body(b"one\r\ntwo\r\n\r\n"), b"one\ntwo\n")
        self.assertEqual(checker.normalize_body(b"one\n"), b"one\n")
        self.assertEqual(checker.normalize_body(b""), b"\n")


class DecisionTests(unittest.TestCase):
    def test_all_nine_decision_combinations(self):
        expected = {
            ("holds", "holds"): "reject", ("holds", "does-not-hold"): "apply", ("holds", "unknown"): "undecided",
            ("does-not-hold", "holds"): "reject", ("does-not-hold", "does-not-hold"): "reject", ("does-not-hold", "unknown"): "reject",
            ("unknown", "holds"): "reject", ("unknown", "does-not-hold"): "undecided", ("unknown", "unknown"): "undecided",
        }
        for pair in itertools.product(("holds", "does-not-hold", "unknown"), repeat=2):
            with self.subTest(pair=pair):
                self.assertEqual(decision([pair[0]], [pair[1]]), expected[pair])

    def test_malformed_records_fail_validation_without_crash(self):
        catalog, _ = checker.loader.load_catalog()
        for value in (None, [], {}, {"cards": [None]}, {"cards": [{}]}):
            with self.subTest(value=value):
                self.assertTrue(validate(value, catalog))

    def test_duplicate_card_rejected(self):
        record = json.loads((ROOT / "skills/fixtures/design-sound/record.json").read_text())
        record["cards"].append(copy.deepcopy(record["cards"][0]))
        self.assertIn("coverage", {error["rule"] for error in validate(record)})

    def test_unknown_exclusion_cannot_apply(self):
        record = json.loads((ROOT / "skills/fixtures/design-sound/record.json").read_text())
        card = next(c for c in record["cards"] if c["decision"] == "apply")
        card["do_not_use_when"][0]["verdict"] = "unknown"
        self.assertIn("decision-undecided", {error["rule"] for error in validate(record)})


class OutputBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.record = Path(self.tmp.name) / "record.json"
        self.output = Path(self.tmp.name) / "output.md"

    def call(self, skill, script, record, output=False):
        self.record.write_text(json.dumps(record))
        command = [sys.executable, str(ROOT / "skills" / skill / "scripts" / script), str(self.record)]
        if output:
            command += ["--output", str(self.output)]
        return subprocess.run(command, capture_output=True, text=True)

    def test_invalid_design_record_cannot_write_plan(self):
        record = json.loads((ROOT / "skills/fixtures/design-sound/record.json").read_text())
        record["cards"].pop()
        result = self.call("verification-design", "render_plan.py", record, output=True)
        self.assertEqual(result.returncode, 3)
        self.assertFalse(self.output.exists())

    def test_unknown_on_rejected_card_surfaces_in_plan(self):
        record = json.loads((ROOT / "skills/fixtures/design-sound/record.json").read_text())
        card = next(c for c in record["cards"] if c["decision"] == "reject")
        card["do_not_use_when"][0]["verdict"] = "unknown"
        card["do_not_use_when"][0]["evidence"] = "The artifact does not establish this exclusion."
        result = self.call("verification-design", "render_plan.py", record, output=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn(card["do_not_use_when"][0]["condition"], self.output.read_text().split("## Not verified", 1)[1])

    def test_audit_missing_question_fails_coverage(self):
        record = json.loads((ROOT / "skills/fixtures/audit-known-defect/record.json").read_text())
        record["checks"].pop()
        result = self.call("verification-audit", "validate_findings.py", record)
        self.assertEqual(result.returncode, 3)
        self.assertIn("coverage", {e["rule"] for e in json.loads(result.stdout)})

    def test_unmapped_free_defect_routes_to_no_card(self):
        record = json.loads((ROOT / "skills/fixtures/audit-missing-evidence/record.json").read_text())
        record["checks"].append({"free": True, "principle": 5, "question": "Does the report preserve the criterion identifier?", "status": "defect", "evidence": "Illustrative report row omits its criterion identifier.", "failure": "unmapped", "failure_note": "Missing criterion identifier in the emitted row.", "severity": "low"})
        routed = self.call("verification-audit", "route_failures.py", record)
        self.assertEqual(routed.returncode, 0, routed.stdout + routed.stderr)
        routed_record = json.loads(routed.stdout)
        self.assertEqual(routed_record["checks"][-1]["cards"], [])
        self.assertIs(routed_record["checks"][-1]["routed"], False)
        rendered = self.call("verification-audit", "render_findings.py", routed_record, output=True)
        self.assertEqual(rendered.returncode, 0, rendered.stdout + rendered.stderr)
        text = self.output.read_text()
        self.assertIn("no routed card", text)
        headings = [line for line in text.splitlines() if line.startswith("## ")]
        self.assertEqual(headings, ["## Defects", "## Checked and sound", "## Not checked", "## Insufficient evidence"])

    def test_tampered_routing_cannot_write_findings(self):
        record = json.loads((ROOT / "skills/fixtures/audit-known-defect/record.json").read_text())
        routed = self.call("verification-audit", "route_failures.py", record)
        self.assertEqual(routed.returncode, 0)
        record = json.loads(routed.stdout)
        defect = next(c for c in record["checks"] if c["status"] == "defect")
        defect["cards"][0]["source_url"] = "https://example.invalid/mutable"
        result = self.call("verification-audit", "render_findings.py", record, output=True)
        self.assertEqual(result.returncode, 3)
        self.assertEqual(json.loads(result.stdout)[0]["rule"], "routing")
        self.assertFalse(self.output.exists())


if __name__ == "__main__":
    unittest.main()
