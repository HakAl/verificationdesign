# LLM Judges Have Dark Current: A Psychometric Datasheet for LLM-as-a-Judge Evaluation

Reviewed: 2026-08-05
Reviewer: Codex draft; Claude architect read full text; human review pending
Source: https://arxiv.org/abs/2606.15610
Evidence grade: C
Grade confidence: medium

## Why It Matters

The criterion-shift result is operationally sharp: tightening a judge prompt can suppress false preferences by making the judge abstain more, not by improving discrimination. A single accuracy or agreement number cannot separate those mechanisms. The protocol also corroborates position effects through a different design than rubric option selection, but the authors explicitly frame it as measurement groundwork rather than a broad downstream claim.

## Method / Evidence

Read: arXiv abstract plus a full-text pass over the HTML.

- The Judge Datasheet protocol has five measurement arms: A0 True Vacuum using empty strings, whitespace, and identical pairs; A1 Controlled Quality Ladder using prefix-chain stimuli and nested requirement sets; Delta0 controls using same-subset surface variations and different-subset pairs; a direction-stability decomposition separating stable from positional contributions; and a criterion-shift probe testing whether prompting moves the tie/preference threshold.
- Three open-weight judges were tested on 10 tasks: Llama-3.1-8B, Qwen2.5-14B, and Qwen2.5-32B. The design used 60 canonical Delta0 same-subset pairs, plus 50 Delta1, 40 Delta2, 30 Delta3, 20 Delta4, and 10 Delta5 pairs, each in both presentation orders.
- Table 3 reports dark current, raw Delta0 false preference, stable cross-sensitivity, and positional false preference respectively: Llama-3.1-8B 0.667 / 1.000 / 0.033 / 0.967; Qwen2.5-14B 0.000 / 0.992 / 0.450 / 0.533; Qwen2.5-32B 0.000 / 0.258 / 0.000 / 0.083.
- Dark current is false preference under no signal. Llama-3.1-8B showed 67% false preference in true vacuum, while both Qwen judges were vacuum-clean at 0.000.
- Raw Delta0 false preference conflated distinct mechanisms. Llama-3.1-8B's raw 1.000 decomposed into 0.033 stable cross-sensitivity and 0.967 positional false preference, so the raw result is not evidence of surface-form sensitivity.
- Under the strict tie prompt in Table 4, Qwen2.5-32B raw Delta0 false preference fell from 0.2583 to 0.0000, while Delta1 target sensitivity fell from 0.9400 to 0.5000. The loss occurred through miss-by-tie; Delta1 wrong-choice rate remained 0.0000. Delta5 sensitivity remained 1.000 to 1.000. The prompt moved the criterion, not the resolution.

## Limitations

The authors state that the stimulus ladder is synthetic rather than ecological, with no human ground truth or reference judges. Only three open-weight judges are tested, which they call insufficient for broad claims. Delta75 is left-censored for the Qwen models. The downstream mechanism hypothesis is explicitly unconfirmed; the contribution is a metrological protocol for measuring the measuring device before downstream claims. The Artifact Statement says this arXiv version has no separate public artifact release, and full logs are withheld for privacy. The judge models are small and a generation behind, limiting transfer to frontier judges.

## Suggested Update

Propose a dated methods note corroborating the rubric position-bias study through pairwise preference, different judges, and a different stimulus design. This is the weaker leg of the pair because the authors disclaim breadth. Disposition: hold-and-watch until ecological replication, not fold.

## Claims Needing Human Review

- Whether an author-disclaimed protocol paper should be cited canonically at all or remain in the note layer until an ecological replication exists.
