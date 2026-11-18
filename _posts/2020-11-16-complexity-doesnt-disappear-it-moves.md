---
layout: post
title: Complexity Doesn't Disappear, It Moves
description: Cloud-native tooling is often accused of adding complexity. I think it mostly relocates it, and the new location is usually an improvement.
category: infrastructure
tags: kubernetes security infrastructure
---

A common complaint about cloud-native infrastructure is that it is too
complicated. A cluster, a service mesh, an identity provider and a certificate
authority is a lot of machinery to put in front of a web service that used to
be a process on a server, and the complaint is not unreasonable.

I no longer think it is quite the right complaint. The complexity was already
there. What the tooling has done is move it, and where it has moved to is, in
most of the cases I care about, a better place to keep it.

## The complexity was in the iptables

My [Kubernetes networking]({% post_url 2017-06-30-kubernetes-networking %})
post is an inventory of where a Service goes when you stop looking at it. A
stable address that survives rolling updates sounds like a simple feature, and
it is implemented as a set of `iptables` rules written by a controller, with
connection tracking undoing the translation on the way back. None of that is
simple. It is merely not mine. Before Services, the same problem was solved
with port allocation conventions and hand-maintained load balancer
configuration, and the failures were just as intricate, spread across more
people and less documented.

That is the pattern worth noticing. A problem that was always hard gets solved
once, in a maintained component, with a defined interface, and the people who
used to solve it by hand now depend on that interface instead.

## Three places it has moved

Certificates are the clearest example. Issuing, distributing and rotating them
by hand is a task nobody does well, because it happens too rarely to build
habits around and too importantly to get wrong. Automated issuance moves that
work into a component that runs continuously and fails loudly.

Service-to-service authentication follows the same shape. Encrypting and
authenticating traffic between services used to mean each service doing it its
own way, if at all. A mesh that establishes mutual TLS moves the work into the
platform, where it is implemented once and can be audited once.

Credentials are the third. A service account key exported from a cloud
provider and copied into a deployment is a secret that outlives its purpose.
Binding a Kubernetes service account to a cloud identity, as GKE's Workload
Identity does, replaces a long-lived key with an identity the platform vouches
for. The secret has not become simpler. It has stopped existing.

## Why relocation is an improvement

Moving complexity is only worth doing if the destination is better, and I think
it usually is for a specific reason: the new homes are mature, widely used and
audited by people whose entire job is to find what is wrong with them. A
rotation script written for one team has been reviewed by that team. A
certificate controller has been reviewed by everyone who depends on it.

That does not make the new components free. They have their own failure modes,
and when they fail, the failure is harder to read because I did not write them.
I would still take that trade. A hard problem owned by a mature primitive is
better than the same problem owned by me, in the same way that I would rather
use a cryptography library than write one.

## What this changes about the complaint

The honest version of the complaint is narrower: the new machinery has a
learning cost, and the cost is paid up front by whoever is on call for it. That
is true, and it is an argument for deciding deliberately which pieces you adopt
rather than all of them. It is not an argument that the old way was simple. It
was complicated in places nobody was looking.
