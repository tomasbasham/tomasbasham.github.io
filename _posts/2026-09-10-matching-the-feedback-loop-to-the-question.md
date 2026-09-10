---
layout: post
title: Matching the Feedback Loop to the Question
description:
category: something
tags: technical
---

I recently worked out why I find infrastructure and platform work so satisfying:
it rewards fast, unambiguous, non-negotiable feedback over slow consensus. The
system either works or it doesn't, and it tells you which almost immediately,
without needing a committee to agree first.

Then I noticed I hold what looks like the exact opposite view about how work
should move through a delivery process — inception, planning, feedback,
refinement, estimation, prioritisation, delivery. There, I want the slow
version. I want deep conversation early. I want to be genuinely confident we're
building the correct thing, at the correct time, in the correct order, before
anyone writes a line of code. Only once work actually begins do I want the fast,
harsh, solitary feedback back.

At first glance that looks like holding two contradictory preferences. I don't
think it is. I think it's one preference, applied correctly to two different
kinds of question.

## Two different questions, two different oracles

Any piece of work contains at least two distinct questions, and they are
answered by different mechanisms:

**"Are we building the correct thing, for the correct reason, at the correct
time, in the correct order?"**

There is no protocol for this. No kernel, no compiler, no test suite can tell
you whether the feature you're about to build solves the right problem, or
whether now is the right time to build it, or whether it should come before or
after some other piece of work. The only oracle available for this class of
question is *other people's judgement and context* — the salesperson who knows
what the customer actually asked for, the engineer who remembers why the last
attempt at this failed, the person who knows a dependency is landing next
quarter that changes the whole calculus. Getting this wrong is expensive, but
it's *cheap to get right*, because at this stage a wrong assumption costs a
conversation, not a rewrite. Slow, deliberate, many-voiced deliberation isn't a
tax you pay here — it's the actual mechanism by which correctness is produced.
There is no shortcut, because there is no other oracle to consult.

**"Is this implementation correct?"**

Once the "what" and "why" are settled, this question has a different, better
oracle: the system itself. Does the code compile. Does the protocol negotiate
correctly. Does the cluster schedule the workload. Does the test pass. This
oracle is faster than any committee and cannot be argued with, reframed, or
politely disagreed with over Slack. Continuing to seek consensus here -
re-litigating direction mid-implementation, holding design-by-committee meetings
about something the compiler already has an opinion on — is now pure cost. The
question that needed people has already been answered; what's left needs a
system.

## The actual principle

So the shape of the preference isn't "fast feedback good, slow feedback bad," or
its inverse. It's: **match the feedback mechanism to whichever oracle can
actually answer the question at that stage of the work.**

Before work starts, the only available oracle is human judgement, so that's
where the deliberation belongs. Once work starts, a better and faster oracle
becomes available — the system itself — so that's where the deliberation should
move to. Getting this backwards produces two very recognisable and very
different failure modes:

- **Skip the discovery conversation, and everyone builds fast,
  locally-consistent, collectively wrong things.** Each engineer's individual
  work might have excellent, unambiguous feedback loops — the code works, the
  tests pass — but the team has quietly built four different unreconciled
  interpretations of what "the feature" was supposed to be, and nobody notices
  until integration, or until it ships to a customer who asked for something
  else entirely. There are mechanisms to mitigate this but that is out of scope
  for this post.

- **Keep having the discovery conversation once work has started, and you get
  stalled implementation.** People start re-arguing direction mid-build, because
  the habit of deliberation didn't know when to stop. The system already has an
  opinion — the tests are failing, the integration doesn't work — and instead of
  listening to it, the team keeps convening. This is design-by-committee applied
  to a question the compiler already answered.

Both failure modes look, from a distance, like "too much" or "too little"
process. They're actually the same mistake in opposite directions: consulting
the wrong oracle for the question in front of you.

## Why this isn't really about speed

It would be easy to summarise all this as "be slow up front, be fast later" -
but that framing misses the point and would misfire the next time the shape of
the problem changed. The principle isn't about speed at all. It's about *which
mechanism is capable of producing a correct answer to the specific question
being asked right now*. Early on, that mechanism is conversation, because
nothing else can see the context a person can see. Later, that mechanism is the
system, because nothing argues with a protocol and wins.

Held this way, wanting deep committee-style deliberation during planning and
wanting to work entirely alone against an unambiguous system once work begins
aren't in tension. They're the same underlying judgement, applied twice,
correctly, to two different questions that happen to sit next to each other in
the same piece of work.
