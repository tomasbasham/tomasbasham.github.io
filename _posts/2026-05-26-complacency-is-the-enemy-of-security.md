---
layout: post
title: Complacency is the Enemy of Security
description:
category: security
tags: security risk technical-debt security-culture
---

There is a particular kind of institutional blindness that develops when nothing
has gone wrong for a while. It is not laziness, exactly. It is not negligence in
the obvious sense. It is something more insidious: the slow, unannounced erosion
of urgency that comes from the absence of consequences. In security, we have a
name for it. We call it complacency, and it is far more dangerous than most
organisations are willing to admit.

## The silence before the breach

The organisations that suffer the most significant security failures are rarely
those that never thought about security at all. They are, far more often,
organisations that thought about it once — set up some reasonable foundations,
shipped a product, watched it run without incident — and then quietly stopped
thinking about it. The lack of visible harm became, over time, indistinguishable
from safety.

This is a deeply human tendency, and it extends well beyond software. An
engineer who has driven the same road for years without incident starts to ease
off on the margins: a little faster, a little less attentive. A business that
has never had a fire stops testing whether the extinguishers still work. A
platform that has never been breached stops asking what it would take to breach
it.

The absence of a bad outcome is not evidence that a bad outcome cannot
happen. It is simply evidence that it has not happened yet.

## The signals most teams ignore

Security researchers have a thankless job. They find the holes, report them
through whatever responsible disclosure channels exist, collect their
acknowledgement, and move on. Most engineering teams treat these reports as
one-off incidents to be resolved and closed. The ticket gets a fix, the
researcher gets a thank-you, and the queue clears.

What most teams do not do is treat a researcher's report as a question worth
sitting with: *if someone motivated enough to look found this, what else is
waiting to be found?* The honest answer, in most cases, is: quite a lot.

Security researchers are, by definition, people with both the skill and the
intent to look for problems responsibly. They represent a fraction of the total
population of people who might look at your platform. For every researcher who
files a report, there is an unknowable number of people who found the same thing
and said nothing — or who are still looking.

Treating a disclosure as a closed incident, rather than a prompt for deeper
review, is one of the clearest signs that complacency has taken hold.

## What complacency actually looks like in practice

It rarely announces itself. It does not look like a decision to de-prioritise
security. It looks like other, more reasonable-sounding things.

It looks like a security improvement that keeps getting bumped from the sprint
because there is always something more pressing. It looks like known credential
hygiene issues that are tolerated because rotating them requires coordination
and nothing has gone wrong so far. It looks like service-to-service
authentication that relies on ambient trust because nobody has had time to
implement something more rigorous. It looks like hardening work that exists on a
backlog but has no owner, no deadline, and no champion.

None of these are unusual. Most engineering organisations carry some version of
all of them. The question is not whether you have technical debt in your
security posture. The question is whether you are treating that debt as inert or
as compounding.

Technical debt compounds. Security debt, in particular, compounds with interest.

## The asymmetry you cannot ignore

There is a brutal asymmetry at the heart of security that complacent
organisations tend not to dwell on. You need to get it right every time. An
attacker only needs to get it right once.

Your organisation has a roadmap, a budget, a hiring plan, competing priorities,
and finite attention. An attacker has one objective. They are not constrained by
your sprint cycle. They do not need to attend your planning meeting. They can be
patient in a way that no internal team can afford to be.

This asymmetry means that the cost of complacency is not spread evenly over
time. It accumulates silently until it discharges in a single event — an
exploit, a breach, a disclosure — at a time and in a manner entirely of the
attacker's choosing, not yours.

Proactive security work is expensive. Reactive security work, when it is forced
upon you at the worst possible moment, is far more so — in engineering time, in
reputational damage, in customer trust, and sometimes in regulatory consequence.

## Waiting for harm is not a strategy

The argument that is implicitly being made when security work gets consistently
deprioritised is this: *we will address this when there is evidence it needs
addressing.* The problem is that in security, the evidence arrives in the form
of an incident. By the time you have proof that the risk was real, you are
already managing the fallout.

This is categorically different from most other kinds of product risk. If you
defer a performance optimisation, you will see slow response times. If you defer
a UX improvement, you will see friction in your conversion data. The feedback
loop is relatively tight. With security, the feedback loop can be years long —
or it can be instantaneous and catastrophic. There is often no middle ground.

The organisations with the strongest security postures are not those that
responded fastest after a breach. They are the ones that treated the work as
continuous, unglamorous, and non-negotiable — even, and especially, when nothing
was on fire.

## The uncomfortable conversation

If you lead an engineering organisation and you have been honest with yourself
whilst reading this, you may be sitting with some recognition. There are things
your team knows about — credential hygiene that needs attention, authentication
patterns that need revisiting, third-party access that needs auditing — that
have not been addressed because they have not yet caused a visible problem.

The question is not whether those things carry risk. They do, and everyone
involved knows they do. The question is whether your organisation's culture
treats security as a property to be actively maintained or as a state you are
passively in until proven otherwise.

Complacency is not a failure of intelligence. It is a failure of prioritisation,
sustained over time, in the absence of the pressure that a visible incident
would have created. The antidote is not panic. It is building the organisational
habit of treating security as a first-class concern during the quiet periods —
which is to say, before the alternative presents itself.

The researchers who file responsible disclosures are doing you a favour. The
people who do not file reports may also be doing something — just not the kind
that ends with a thank-you email.
