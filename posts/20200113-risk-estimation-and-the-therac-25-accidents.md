+++
date = '2020-01-13T11:59:59-04:00'
title = 'Risk Estimation and the Therac-25 Accidents'
+++
There are some great quotes toward the end of [“An Investigation of the Therac-25 Accidents”](https://simson.net/ref/1993/therac-25.pdf) by Nancy G. Leveson and Clark S. Turner (1993), which is on radiation overdoses caused by bad engineering practices and erroneous risk analysis. More background is [here](https://en.wikipedia.org/wiki/Therac-25).

"Risk assessment data can be like the captured spy; if you torture it long enough, it will tell you anything you want to know." - William Ruckelshaus, former head of EPA

And:
"[the numbers game in risk assessment] should only be played in private between consenting adults, as it is too easy to be misinterpreted." - E.A. Ryder of the British Health and Safety Executive

Some related thoughts on risk assessment numbers, *i.e.* the infinitesimally small probabilities of failure that manufacturers or engineers sometimes estimate, like 10^-9 chance of wrong dose, etc.:
1. They are clearly not to be taken literally.
2. Almost by definition they make many assumptions about situation, use case, or other conditions, and these assumptions are not normally disclosed or even explicitly known.

We might conclude that numerical risk assessments are pretty useless, but I think they can be used as a sort of lie-detector test. A lie detector doesn't really 'detect' lies, *per se*, but just turns up the heat and potentially gives some feedback about avenues of questioning that may be more valuable.

In the same way, when a manufacturer or an engineer cites a risk assessment value, they should be questioned about it – asked precisely what calculations or evidence went into it; how this or that particular factor, or feature of the design, etc., was accounted for and why; how each assumption impacts the overall result; and the like. With this, a reviewer can discover a lot about what went into the risk assessment, and get a sense of how valid the various ratings may be, and what factors were over- or under-weighted, or even ignored.

This can also help to illuminate the thinking behind how the risk assessment was done. In other words, it will show how the sausage was made. Problems revealed in any one part of the analysis are likely present in others as well.

I draw two lessons from all this. First, risk assessments should not be interpreted as being absolute. That is, no two risk assessments are commensurate – they are not calibrated and thus cannot be compared to one another. This should be obvious because they normally lack units – a risk of 10^-9 means what, 10^-9 malfunctions per year? Per day? Per use? And is that a major malfunction, a minor one, or some weighted average of many severities?

Thus, risk assessments can only be compared internally, that is to alternate variants of the same overall design. This augurs more for a rating-type assessment like we use in FMEA, rather than numerical probabilities.

Second, since it's impossible to prove a negative, meaning it's impossible to be certain of finding every possible failure mode, and/or correctly assessing it's likelihood, we are best served by redundancy. That is, the only truly safe designs have extra levels of precaution – interlocks, double-checks, etc. These protections/precautions should take multiple forms, and each should be sufficient independently. And the best form of redundancy takes the form of continuous monitoring and maintenance, where trained technicians observe, test, and assess multiple factors during regular scheduled downtown, or using continuous operating monitoring. Multiple safeguards, multiple checks. That’s the best way to get a low real-world probability of failure.
