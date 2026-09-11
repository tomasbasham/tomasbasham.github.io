---
layout: post
title: The WIP Limit Isn't the Problem
description:
category: something
tags: technical
---

In an earlier post I described a mismatch: I want slow, deliberate, many-voiced
feedback before work starts, and fast, unambiguous, solitary feedback once it
does. The resolution was that these aren't contradictory preferences — they're
the same principle, matching the feedback mechanism to whichever oracle can
actually answer the question at that stage. Human judgement for direction. The
system for execution.

There's a related tension I've watched play out repeatedly on a small team, and
it doesn't resolve the same way. It looks, on the surface, like a scheduling
problem. It isn't.

## The oscillation

The pattern goes roughly like this. The team takes on too many workstreams at
once — not because anyone mis-scoped the sprint, but because everybody wants
something of their own to work on, or believes their thing is the higher
priority, despite that not really being their call to make. So the sprint ends
up planned as a mixture, a bit of everything, to keep everyone satisfied going
in.

Inevitably, little of it finishes cleanly. People are pulled out of their own
work constantly — into code review, into testing sessions, into implementation
discussions for streams they're not even driving — and by the end of the sprint
nobody has actually finished anything. What does get finished is rushed across
the line in the last day or two.

So the retrospective conclusion is sensible: focus on less. Reduce WIP. The next
sprint, people pair or mob rather than each running their own stream.

And then a different problem shows up. Only one person can drive at a time. The
others — the navigators — get bored. They start quietly working on side things
during the session, less engaged, present but not really there. The work does
get finished on time this time. But people feel flat about it. Demotivated.
Under-stretched. Convinced more could have been achieved.

So the next retrospective says: let's take on more, give people their own things
again. And the cycle restarts.

## Why this isn't a WIP problem

The obvious read is that the team hasn't found the right WIP limit yet — too
high causes thrashing, too low causes disengagement, so somewhere in between
must be correct. I don't think that's right, and there's a tell in the pattern
that gives it away: **it's frequently the same people, unhappy in both states.**
The person complaining "I never get to finish anything, everything's rushed" in
the high-WIP sprint is often the same person complaining "I'm bored, I'm not
really contributing" in the paired sprint.

If WIP were the actual variable, you wouldn't expect that. You'd expect the
complaints to come from different people depending on their tolerance for
context-switching versus their tolerance for close collaboration. Instead the
same individuals are dissatisfied on both sides of the dial, which suggests the
dial isn't the thing they actually care about.

What they're asking for, in both states, looks like the same underlying thing:
**individual, attributable ownership of a solved problem.** Something they
drove, that's recognisably theirs, that demonstrates the specific expertise they
bring to the team. High WIP gives everyone a shot at that — their own stream,
their own area — but not the completion of it, because constant interruption
means nothing actually gets finished under their name. Pairing gives the
completion, but only to whoever's driving that session; the navigator gets the
outcome without the authorship.

Neither format is failing at its stated job, either. Throughput-wise, the
low-WIP sprints work — the team said as much, work gets done on time. What's
failing is a need nobody's named out loud in the retrospective, because "reduce
WIP" and "pair more" are the only vocabulary a sprint retrospective tends to
offer. Recognition and demonstrated individual expertise aren't on that menu, so
the dissatisfaction keeps getting misdiagnosed as a process setting, and the
process gets nudged back and forth in search of a value that isn't on that axis
at all.

This is also, worth naming, the same shape of mistake as the oracle-mismatch
from the earlier post, one level up: **using a process mechanism (a WIP limit, a
pairing cadence) to try to solve a need that mechanism was never built to
answer.** A WIP limit is a good tool for managing flow efficiency and reducing
thrash. It has no lever for felt ownership. Turning the dial harder in either
direction won't produce a value it was never designed to hold.

## Where "shaping" fits, and where it doesn't yet

This team has already tried, independently, to address a version of this — worth
mentioning, because it's evidence the diagnosis isn't invented after the
fact. We've been experimenting with a **shaping** model rather than conventional
planning: a rotating pair kicks off each initiative with a lightweight outline,
the relevant specialists feed in asynchronously by area, a short huddle resolves
anything unclear, and the facilitator role — whoever drives that shaping —
rotates each time rather than defaulting to the same person.

The intent lines up closely with the diagnosis above. Rotating the facilitator
role exists specifically so ownership of *direction* doesn't collapse onto one
person, and so people get turns leading rather than only ever being told what to
build by some fixed authority. That's a genuine, structural answer to part of
the ownership problem — at the design stage.

But it's a partial answer, not a full one, because it operates entirely upstream
of the point where the oscillation actually happens. Shaping answers "who got
heard on the plan, and who's facilitating it." It doesn't yet answer "who gets
to drive — and finish, under their own name — the *implementation*." A team can
rotate shaping facilitators well and still hit the exact same
pairing-versus-solo tension once building starts, because that tension lives
entirely in execution, which shaping doesn't touch. The gap this post is
describing sits downstream of everything shaping currently covers.

## What would actually close the gap

If the diagnosis is right, the fix isn't a better WIP number, and it isn't more
or less pairing as a blanket policy. It's treating ownership itself as something
to be deliberately distributed across the roadmap over time — giving each person
a stream they drive end-to-end some of the time, and pairing or mobbing at other
times, rather than picking one mode as "how we work now" and applying it
uniformly until it stops working and gets swapped for its opposite.

Concretely, that might look like extending the same rotation instinct that
shaping already applies to facilitation, into execution: an explicit "who owns
driving this through to done" decision made once at the start of an initiative,
visible to the team, changing initiative to initiative — rather than an
implicit, unnamed scramble for it that shows up as either too many parallel
streams or too many bored navigators, depending on which way the last
retrospective nudged the dial.

That's a bigger change than adjusting a WIP limit, and it's probably a harder
one to get agreement on — which is exactly why the team needs to see the
diagnosis clearly first. Turning the dial feels like doing something. Naming
what the dial can't fix is less comfortable, but it's the only version of this
conversation that stops it from repeating next sprint.

## Why driver rotation rarely survives contact with reality

There's a smaller-scale version of this same tension worth naming, because it
complicates the conclusion above rather than just illustrating it. Pairing's
usual answer to the navigator-boredom problem is to rotate the driver
frequently, so everybody gets a turn. In practice, this rarely happens without
real discipline enforcing it, and it's worth being honest about why — because
the reasons aren't laziness, they're structural, and they mirror the diagnosis
in this post rather than contradicting it.

Natural stopping points are genuinely hard to find mid-problem. And there's a
cost to handing over that's easy to underrate: driving isn't just operating the
keyboard, it's holding the current shape of a half-built solution in your
head. Handing that off mid-thought means someone else has to either preserve
your intent or quietly replace it with their own — and watching your own
partially-built approach get "ruined" by somebody else's direction, while you
can only observe, is a real and specific discomfort, not a reluctance to share
credit in the abstract. Rotate too eagerly and you can destroy the very
ownership the rotation was meant to produce, because ownership includes
authorship of the approach, not merely presence in the room.

There's also a genuine efficiency case against rotating, most often raised on
work that sits squarely in someone's area of expertise: "I could do this faster
if I were just allowed to drive." That's frequently true in the moment. What it
discounts is that letting someone else drive is how they get faster at this next
time — the return shows up later, as team capability, not now, as this task's
completion time. That's the same mistake in miniature as everything else in this
post: using a short feedback loop (is this task faster today) to answer a
question that should be answered by a longer one (is the team faster over the
next ten initiatives). Left unmanaged, the short loop wins by default, because
it's the one everyone can feel immediately.

And sometimes the honest answer is that there simply isn't slack to spend on
anyone's growth right now. Pressure to ship is often too real for "slow down so
everyone catches up" to be viable, and in those moments some work is genuinely
better driven by whoever's fastest at it, full stop.

None of that undermines the conclusion above. The point was never that ownership
should rotate mechanically, on principle, at every opportunity; it's that
rotation should be a deliberate default, consciously overridden when the cost of
slowing down is genuinely too high, rather than something that silently never
happens because nobody wanted to be the one to insist on it. That distinction —
deliberate concentration under acknowledged pressure, versus ownership quietly
never rotating because handing over is uncomfortable — is exactly the difference
between a team managing this tension on purpose and a team stuck oscillating
through it by accident, which is the whole problem this post set out to
describe.
