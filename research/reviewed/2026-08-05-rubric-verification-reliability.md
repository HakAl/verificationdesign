# RuVerBench: LLM-as-a-Judge Reliability for Rubric Verification in Agentic Scenarios

Reviewed: 2026-08-05
Reviewer: Codex draft; Claude architect read full text; human review pending
Source: https://arxiv.org/abs/2606.29920
Evidence grade: B
Grade confidence: high

## Why It Matters

Rubric verification is how explicit criteria become operational judgments. RuVerBench measures the reliability of that step per rubric rather than hiding it inside an overall score. Its batching result is directly actionable: batching rubrics to save tokens reduces accuracy, with steep losses on long agent trajectories. Its low cross-judge error overlap also helps distinguish organic verification errors from the optimization-induced shared failure basin reported in the reference-free reward-hacking study.

## Method / Evidence

Read: arXiv abstract plus a full-text pass over the HTML.

- The benchmark contains 2,458 instances: 1,615 Deep Research rubrics and 843 Agentic Coding rubrics. Each instance pairs a model-generated output with one rubric and a binary human satisfaction label. Deep Research outputs average 7.1K tokens and draw from ResearcherBench, ResearchRubrics, and DeepResearch Bench II. Agentic Coding trajectories average 49.4K tokens and draw from OctoBench.
- Deep Research rubric categories are Format, Numbers, Logic, and Facts. Agentic Coding categories are Task, Planning, Tools, and Rules.
- Independent hired annotators and an internal group each labeled all rubrics; disagreements were adjudicated by rechecking evidence. The two label sets agreed on 90.4% of rubrics, with Cohen's kappa = 0.808. Annotation required about 500 person-hours and approximately USD 24.5K.
- Average Balanced Accuracy on Deep Research was 94.7 for Gemini-3.1 Pro Preview and 91.4 for GPT-5.4. On Agentic Coding it was 89.4 for GPT-5.4 and 86.5 for Gemini-3.1 Pro Preview. The best Agentic Coding result therefore remained 10.6 points below perfect.
- Open-weight models were competitive: Kimi K2.6 ranked second on Deep Research and fourth on Agentic Coding; DeepSeek V4 Pro was within 0.5 points of the top score.
- Strict versus Flexible prompting on Agentic Coding changed GPT-OSS-120B by +8.5 points and Qwen3.5-27B by +11.8 points; top-tier models stayed within +/- 3 points.
- Batching 4 rubrics per call on Deep Research cost an average 1.5 points. On Agentic Coding, every tested model lost accuracy with 4 or 5 rubrics per call, often by double digits. The authors attribute the larger loss to attention fragmentation over longer trajectories.
- Majority voting reduced sampling noise but did not correct systematic errors. Deep Research gains plateaued around +/- 1 point regardless of vote count. Agentic Coding gained +2 to +3 points at 3 to 5 votes and then flattened. The authors suggest 3 to 5 votes as an initial operating range.
- Common errors were partial satisfaction, where fragmentary evidence was accepted as full fulfillment, and requirement expansion, where the judge imposed extra constraints.
- Error overlap among Gemini-3.1 Pro Preview, GPT-5.4, and Claude Opus 4.7 was only 16.1% in Deep Research and 20.6% in Agentic Coding. This indicates distinct behavioral profiles rather than one shared systematic flaw in these organic settings.
- Category-level results varied enough that an overall score masked weaknesses. Tools and Rules were the Agentic Coding bottlenecks.
- The dataset and evaluation code are released at https://github.com/THU-KEG/RuVerBench. This is a reproducibility fact bearing on the grade. Tsinghua University and Tencent Hunyuan affiliation is an authority fact that tunes confidence only and does not move the grade.

## Limitations

This is a preprint limited to Deep Research and Agentic Coding. Labels are binary; the authors note that graded labels would support finer analysis. The evaluated model set will date as models change.

## Suggested Update

Propose a dated note keyed to the explicit-criteria material: rubric-level judge reliability is task-, category-, prompt-, and batching-dependent, so explicit criteria still require a validated execution mechanism. Record the 16.1% and 20.6% error overlap as a constraint on generalizing the shared-signal ensemble argument from optimization-induced adversarial candidates to organic rubric verification.

## Claims Needing Human Review

- Whether low error overlap supports cross-judge ensembling in organic rubric verification even though reference-free reward optimization defeats ensembles. These may be distinct regimes, and drawing that boundary is a judgment call.
