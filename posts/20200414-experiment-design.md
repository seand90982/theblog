---
date: 2020-04-14
title: Experiment Design
---
Building effective experiments is one of the most fundamental parts of engineering. Experiments are how engineers interrogate a design space, it's how we measure what we're doing and what we've done, and how we decide what to keep or change in the future.

When building set of experiments (often called a DOE), it's best to frame it by asking questions. That is, what questions do you intend this DOE to answer?

So often I've seen DOEs built by just thinking about what test structures to include, or what measurements to do. This leads to the creation of either very long lists of variations to make to a design (the shotgun approach, or even worse, the matrix approach, where every variant is crossed with every other variant), or it leads to an incoherent set of experiments/variants. You end up with a laundry list of variables to include or measurements to perform, many of which may be thematically relevant, but which, when taken together, give you only only partial or provisional answers.

Framing DOE construction as a question-asking exercise performs two functions:
1. Concretely, it forces you to organize the experiments around what information you wish to extract.
2. More generally, and more abstractly, it forces you to become clear about what it is you actually want to learn.

You should think all the way through the chain: First, list out the questions you want answers to. For each question, determine what measurement would need to be done, and on what set of samples/variants/materials/etc. Map out the whole experiment: which equipment, what measurement conditions, who will do it, when, where, are controls needed, must it be repeated or is once sufficient, what are the potential confounders, etc.

Also, think about what results you might get – could they be uncertain (how to avoid that?), are you uncertain as to what experimental conditions are needed, or whether you have the equipment/facilities to obtain those conditions? You should be prepared for any possible result (including surprising ones) and anticipate what follow-on experiments you'll want to do.

Also think about what design changes you'll want to make as a consequence of what you learn from the experiments – what knock-on effects would those changes have, and are there any other experiments you'll need to do to validate or de-risk those changes?

The main thing is to try to be clear about what questions you're even asking in the first place, and make sure your DOE is going to answer them! Too many DOEs don't even do those two simple things.
