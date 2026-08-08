# Position Bias in Rubric-Based LLM-as-a-Judge

Reviewed: 2026-08-05
Reviewer: Codex draft; Claude architect read full text; human review pending
Source: https://arxiv.org/abs/2602.02219
Evidence grade: B
Grade confidence: medium

## Why It Matters

Explicit criteria make judgment legible but do not remove presentation bias. Rubric-based judging introduces bias over both score-option order and criterion order. The operational consequence is substantial: rubric option ordering changed the top-ranked response on 16% to 39% of prompts. The study also fills a gap named in the existing IRT judge-reliability note, which does not capture position bias.

## Method / Evidence

Read: arXiv abstract plus a full-text pass over the HTML.

- This inference-only study evaluated six open-weight judges: GPT-OSS-20B, GPT-OSS-120B, Qwen3.5-9B, Qwen3.5-27B, Gemma-3-12B, and Gemma-3-27B. The datasets were MT-Bench (320 responses), Vicuna-Bench (320), HANNA (576 evaluations over 6 criteria), and SummEval (1,600 evaluations over 4 criteria).
- The study frames rubric evaluation as an implicit multiple-choice task over score options. It measured bias with chi-squared goodness-of-fit against uniform 1/n selection and Cramer's V across rubric scales n in {2,3,5,9}.
- Every chi-squared test on HANNA and SummEval was significant at p<0.05; the smaller datasets were underpowered.
- Bias direction was model-specific. On SummEval, GPT-OSS-20B selected the first position 25.3% of the time versus 18.3% for position 5. Gemma-3-27B selected the first position 11.5% of the time versus 31.4% for position 5.
- Criterion ordering was an orthogonal bias axis. Across HANNA and SummEval, 56 of 60 judge-criterion Friedman tests were significant. The largest shift was 0.80 points on a 5-point scale.
- At K=10, differences between balanced cyclic permutations and random permutations included zero in 11 of 12 cells, with point estimates from -0.008 to +0.015. Exact balance offered no advantage over randomization; variance reduction through aggregation produced the benefit.
- Roughly two-thirds of the improvement from K=1 to K=10 was achieved by K=3, and about 85% by K=5.
- Debiasing improved human correlation only for strongly biased judges. Balanced beat Fixed in 5 of 12 cells and never lost, but gains were often negligible.
- Option order flipped the top-ranked response on 16% to 39% of prompts. Kendall tau between orderings ranged from 0.67 to 0.85.

## Limitations

The study covers open-weight models only because of its stated budget constraint, with no recent closed-source frontier judges. It does not apply its methods to the rubric-based training use case that motivates the work. No data or model weights are redistributed, and no clear code release is stated.

## Suggested Update

Propose a dated note keyed to the explicit-criteria principle and cross-reference `research/reviewed/2026-06-09-irt-judge-reliability.md`, which names position bias as outside its framework. This study fills that gap. A practical candidate recommendation is to aggregate 3 to 5 random rubric-option permutations; engineering an exactly balanced design appears unnecessary.

## Claims Needing Human Review

- Grade confidence was normalized to `medium` because the schema accepts only low/medium/high. The architect read placed it between medium and high.
- Whether the absence of frontier closed-source judges materially limits transfer.
- Whether the 3 to 5 random-permutation recommendation is concrete enough for canonical prose or should remain in the reviewed note.
