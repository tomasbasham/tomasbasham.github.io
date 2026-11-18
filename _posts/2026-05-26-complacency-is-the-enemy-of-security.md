---
layout: post
title: Complacency is the Enemy of Security
description: The organisations that get hurt worst by security failures are rarely the ones that never thought about security — they're the ones that thought about it once, then stopped.
category: security
tags: risk technical-debt security-culture
---

A particular kind of institutional blindness sets in when nothing has gone
wrong for a while. It isn't laziness, and it isn't negligence in any obvious
sense — it's the slow, unannounced erosion of urgency that comes from an
absence of consequences. Security has a name for this: complacency, and I
think it's more dangerous than most organisations are willing to admit,
because it doesn't look like a decision. It looks like the absence of one.

## How it actually sets in

The organisations that suffer the worst security failures are rarely the
ones that never thought about security. More often they're the ones that
thought about it once, set up reasonable foundations, shipped the product,
watched it run without incident, and quietly stopped thinking about it. Over
time, the absence of visible harm gets treated as evidence of safety, which
it isn't — it's only evidence that harm hasn't happened yet. The same
pattern shows up well outside software: a driver who's taken the same route
for years without incident eases off the margins, a business that's never
had a fire stops testing the extinguishers.

## What a disclosure is actually telling you

Security researchers find holes, report them through whatever disclosure
process exists, and move on. Most engineering teams treat that report as a
closed incident: fix shipped, researcher thanked, ticket closed. What gets
missed is the more useful question underneath it — if someone with the
skill and the inclination to look found this, what else is sitting there
unfound? A researcher who discloses responsibly represents a narrow slice of
the population capable of finding the same class of problem; treating their
report as the whole story, rather than a sample of it, is usually where the
complacency becomes visible from the outside.

## What it looks like day to day

It rarely announces itself as a decision to deprioritise security. It looks
like smaller, more reasonable-sounding things: a hardening task that keeps
losing to something more urgent every sprint, a credential rotation that
keeps getting deferred because coordinating it is annoying and nothing's
gone wrong yet, service-to-service trust that's never been tightened because
nobody's had the time. None of this is unusual — most engineering
organisations carry some version of it. The question worth asking isn't
whether that debt exists, but whether it's being treated as inert or as
compounding. Security debt compounds the same way any other technical debt
does, except the interest is paid in an incident rather than in slower
builds.

## The asymmetry that makes this expensive to get wrong

Security has a structural asymmetry that complacent organisations tend not
to sit with: you have to get it right every time, and an attacker only has
to get it right once. Your organisation has a roadmap, competing priorities,
and finite attention; an attacker has one objective and no sprint cycle to
answer to. That asymmetry means the cost of complacency doesn't accrue
smoothly — it accumulates silently and then discharges all at once, at a
time of the attacker's choosing rather than yours. Reactive security work,
done under that kind of pressure, costs considerably more than the same work
done proactively — in engineering time, in trust, and sometimes in
regulatory exposure.

This is also what makes security different from most other categories of
product risk. Defer a performance fix and you see it in response times.
Defer a UX fix and you see it in conversion. The feedback loop is tight
enough to self-correct. Security's feedback loop is either years long or
instantaneous and severe, with very little in between — which means waiting
for evidence that the risk is real is, in practice, waiting for the incident
itself.

## What the alternative actually looks like

The organisations with the strongest security posture aren't the ones that
recovered fastest from a breach — they're the ones that treated the work as
continuous and unglamorous, including during the quiet periods when nothing
was obviously on fire. That's a harder habit to sustain than it sounds,
because there's no natural internal pressure keeping it alive once the
original incident that prompted the foundations fades from memory. It has to
be maintained deliberately, as a standing property of how the organisation
works, rather than revisited only when something forces the question.

The uncomfortable part is that most engineering leaders already know which
items on their own backlog are this kind of risk — the credential hygiene
that needs attention, the access that hasn't been audited in a while. The
honest question isn't whether those things carry risk; everyone involved
already knows they do. It's whether the organisation treats security as
something actively maintained, or as a state it's passively in until proven
otherwise.
