---
layout: post
title: Why Infrastructure Work Feels Different
description: Infrastructure work isn't satisfying because it has fewer valid designs — it's satisfying because the failure mode is legible, and the feedback is fast enough to work alone.
category: career
tags: infrastructure engineering-culture
---

I'm an application developer by trade. I ended up working in infrastructure and
platform engineering out of necessity — someone had to run the Kubernetes
cluster, someone had to own the cloud account — and somewhere along the way it
became the work I love most. It took me a long time to work out why.

## It isn't a shortage of opinions

The easy answer is that infrastructure has fewer valid ways to do something.
Networking works a particular way. The Linux kernel works a particular way.
Stray from the accepted approach and things simply stop working. Application
development, by contrast, seems to have too many opinions — endless ways to skin
the same cat, and teams that spend real time arguing about which way is correct.

I believed this for a while, and it's half right at best. Infrastructure isn't
actually short of opinions. Ask five platform engineers how to structure a
multi-tenant Kubernetes cluster, whether to run a service mesh, how secrets
should be managed, or what your GitOps topology should look like, and you'll get
five confidently different answers — argued with exactly the same intensity as
any application development debate about state management or dependency
injection.

So "fewer opinions" doesn't hold up. The real difference isn't the number of
valid designs — it's that the failure mode is legible.

Get a BGP configuration wrong, and routes don't propagate. Get kernel cgroup
settings wrong, and the container gets OOM-killed. The system tells you,
unambiguously and quickly, that you were wrong. There's no room for the
failure to be argued away, reframed, or attributed to taste.

A bad abstraction in an application codebase doesn't page anyone at 3am. It
doesn't fail loudly. It just slowly makes the codebase worse, in a way that's
contestable — someone can always argue it's fine, or that the real problem is
somewhere else, or that it's a matter of preference. Correctness in
application architecture is often adjudicated by consensus, because there's
no kernel standing over the code ready to reject it. What I actually value,
then, isn't a smaller solution space. It's fast, harsh, non-negotiable
feedback — the system either works or it doesn't, and it tells you which
almost immediately.

## Domain modelling that's already done for you

I tend to approach architecture through domain modelling first — trying to
understand the shape of the problem before writing anything. I think this is a
large part of why infrastructure work resonates so strongly with me
specifically.

In infrastructure, the domain model is very often *already correct* before I
arrive. The model for how a TCP handshake works isn't up for negotiation.
Someone solved that decades ago, rigorously, and it's simply true. My job is to
discover and apply that model correctly, not to invent it.

In application development, I'm frequently the one who has to invent the domain
model — extracted from a messy, ambiguous, and often contested business reality.
And once I've built that model, other people get a vote on whether it's right,
because there's no external authority to appeal to. One of these is discovery.
The other is invention under scrutiny. They are very different postures to hold
day to day, and I know which one I find more restful.

## Why infrastructure work is easier to do alone

There's a related observation worth separating out, because it looks like the
same claim but isn't: infrastructure work is often easier to solo. The task is
clear, and the solution is often just as clear, or more so.

It would be tempting to say this is because the problems are simpler. They're
not. It's because the blast radius of a decision is usually bounded and
observable. I can make a call, ship it, and watch metrics tell me within
minutes or hours whether I was right — without first needing four other people
to sign off. Application architecture decisions frequently can't be validated
that fast; the consequences of a wrong choice surface weeks or months later,
diffused across a codebase multiple people touch. When feedback is slow,
consensus becomes a substitute for it — you get agreement up front because you
can't get proof. Slow feedback loops breed committees. Fast feedback loops let
one competent person simply get on with it.

## The prediction this makes — and where it holds

If this theory is right, it makes a testable prediction: the parts of platform
work that are *most* application-development-flavoured should feel less
satisfying than the deep infrastructure layer, because that's exactly where the
fast, legible feedback disappears again. Designing the API for an internal
developer platform, or deciding whether something should be a CRD or a Helm
chart, has no protocol standing behind it ready to say "wrong." It's a design
decision, adjudicated by taste and consensus, just like application
architecture.

That prediction holds for me. I enjoy that layer of work too — but noticeably
less than the deep infrastructure layer beneath it. Which suggests the
feedback-loop explanation is doing the real work here, not the "fewer opinions"
explanation I started with.

## Discovery, not invention under scrutiny

Infrastructure work rewards being right quickly rather than persuasive slowly.
The domain is already correctly modelled by physics and protocol, so the work is
discovery rather than invention-under-scrutiny. And because the blast radius of
most decisions is bounded and observable, it's possible to act alone and let the
system itself settle arguments that would otherwise need a committee.

That's a satisfying way to spend a working day. It's also, as it turns out,
exactly the wrong way to spend the working days *before* the work begins — which
is a different problem, and one I'll get to separately.
