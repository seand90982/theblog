---
date: 2018-12-11
title: Don't Skip Steps
---
The core engineering design loop is some version of:
  1. Determine requirements
  2. Assign
  3. Design
  4. Document
  5. Review
  6. Implement
  7. Verify

In inexperienced teams, there is often a desire to gloss over 1 & 2, to overly indulge in 3, to then skip straight to 6, and to skimp on 7. This is a recipe for failure in all but the simplest and most self-contained projects.

Design will not go well unless you know your requirements, and have clear lines of ownership and responsibility.

Review is impossible without documentation and knowledge of requirements.
Implementation goes a lot more smoothly with good documentation.
Verification is intractable without documentation, and rudderless without knowledge of requirements.

The looser you are with documenting requirements and design decisions, the harder it is to create a verification plan, and yet the more reliant you are on verification to catch errors.

Verification is meant to catch implementation errors, not design errors. If you have uncertainty in your design, then you should do a DOE around it. In practice, schedule constraints sometimes put pressure on this, and thus verification ends up include some level of design check, but that's a decision that should be made explicitly and with the awareness of the team. In such cases, there should still be a DOE, but it might have to run in parallel with the main design.
