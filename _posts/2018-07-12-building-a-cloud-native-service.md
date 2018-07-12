---
layout: post
title: Building a Cloud Native Service
description: How to use microservices at scale to build modern backend web applications.
category: development
tags: featured development docker grpc kubernetes microservices protobuf web
---

Most modern software services attempt to provide a system that is available
100% of the time to millions of users around the world. However this provides
many challenges in respect to reliability and scalability that are not easily
solved with traditional software development and operational methodologies. In
this article I talk about how a more resilient software service can be achieved
through employing a series of open source technologies and distributed
microservices.

From the very beginning of any project in is often favourable to build a
monolithic application providing familiarity, fewer barriers to entry and
smaller upfront operational costs. However this will later pose a challenge to
scale and therefore be much more difficult to break out into smaller services
that may be independently scaled. Instead, and although a more complicated
concept to that of traditional monolithic applications, I propose beginning a
project by modelling the domain and separating responsibilities into
intercommunicating microservices. Domain modelling is covered widely across
numerous other blog posts so I will not be talking it about it here. I have
linked to several such resources below.

Netflix, and other high profile service providers, have demonstrated how highly
scalable microservices have increased productivity, overall system
maintainability and made more efficient use available resources.

To meet the demands of an always available service I focus on 4 key areas:

1. **Cluster scheduling**: We need an efficient, automated pipeline to manage
   both a small and large numbers of nodes as constraints and resources change.
   It is the responsibility of the container scheduler to distribute work
   appropriately among nodes, and react to machine failure.

2. **Disposable services**: Loosely coupled software services can be considered
   as both disposable and immutable. That is to say refactoring is frowned
   upon, and instead of restructuring code we simply replace it with an
   entirely new service. This provides a proof that a system is resilient to
   change.

3. **Reliable data interchange**: With large numbers of services distributed
   across hosts, data centres, and even continents, the success of our system
   depends on having a solid RPC layer that can route around component failure,
   minimise latency, and help us understand its runtime behaviour. This layer
   has to make our system stronger than its weakest link.

4. **Consistent network transport**: Service meshes are an increasingly common
   networking model for cloud native architectures. By putting the logic needed
   for fast and reliable interservice communications into a sidecar process,
   developers on independent teams, working in the technology stack of their
   choice, can get a consistent network transport without requiring libraries
   or changes to their application code.

**Note**: I realise this list does not cover other important topics such as
network security, asynchronous communication and eventual consistency to
mention just a few. I may cover these in a later post.

### Cluster Scheduling

If we want to build a fault-tolerant, elastically-scalable system, it follows
that we need the ability to add and remove servers as hardware fails, and as
user demand changes. Running only a single service per host is wasteful (the
service may not need all the resources of the host), and the traditional
approach of manually partitioning services among hosts is tedious and difficult
to scale.

Cluster schedulers are designed to abstract applications away from the hardware
on which they run. They use algorithms to schedule applications onto hosts
according to their resource requirements, scale them up and down, and replace
them when they fail. It’s our ultimate goal to run our entire system on a
scheduler, which means we want to deploy stateful as well as stateless apps in
this way.

Containerisation – and Docker in particular – is hard to ignore these days.
Behind the hype, they are simply a combination of technologies in the Linux
kernel coupled with an image format, but they provide a powerful abstraction.
By packaging an application and all its dependencies into a single,
standardised image, the application is decoupled from the operating system, and
isolated from other applications on the same host. A cluster manager that deals
exclusively with containers makes a lot of sense.

For this we decided to use Kubernetes, which we run on a fleet of CoreOS
machines. It is very tightly integrated with Docker, and is the product of
Google’s long experience running containers in production at global
scale. Deploying Kubernetes in a highly available configuration on AWS is not
for the faint of heart and requires you to get familiar with its internals, but
we are very pleased with the results.  We regularly kill hosts in production and
Kubernetes quickly reschedules applications to accommodate. In fact, we may soon
deploy something like Netflix’s Simian Army to deliberately induce failure and
ensure our systems tolerate it transparently.

In addition to improving our resilience, Kubernetes has given us impressive
cost savings. Our production infrastructure costs about a quarter of what it
did before we switched to Kubernetes. To illustrate one example why, consider
our build systems. Previously, we ran several very beefy Jenkins hosts
dedicated to the task, which were inefficient and expensive. Now, build jobs
run under Kubernetes, using spare capacity in our existing infrastructure,
which is basically free. Resource allocations and limits ensure that
resource-intensive but low priority jobs like these do not affect the
performance of critical, user-facing services.

### Disposable Services

Long running services can have indeterministic state. This relates not
exclusively to configuration management tools such as Puppet and Chef that
deploy applications that may not be restarted for some time. During this time
an application may follow many code paths that ultimately lead it to an
unreproducible state. This is undesirable and indicative of a system not
resilient to change.

Chad Fowler, CEO at Wunderlist, gave a great talk about microservices where he
expresses treating each microservice as an immutable component of a system.

<figure class="container container-media">
  <iframe src="https://www.youtube.com/embed/-UKEPd2ipEk?start=850" width="743" height="640" allowfullscreen scrolling="no" referrerpolicy="strict-origin"></iframe>
  <figcaption>Kill "Microservices" before its too late — Chad Fowler</figcaption>
</figure>

In particular Fowler says:

> Mutability of the system is enhanced by the immutability of its components.

This is a great way to consider writing services; just throw away the entire
thing and start again. However this only works when services are small enough
that they can be quickly rewritten.

This idea that code is expendable lends itself well to a polyglot environment
where we may replace an entire service if another language or open source
technology that better suites our needs. Presently I make large use of Swift
and Golang, and whilst these will probably remain the dominant languages
composing any service I may write, using them exclusively means I cannot take
advantage of tools written in other languages.

In a professional sense creating a culture not attached to code is in the long
term highly conducive to a resilient system architecture. If we are able to
design our services to be later thrown away and reimplemented we can move
faster, react more efficiently to issues, and try new things without
unrecoverable repercussions.

### Compatible Data Interchange

As mentioned above polyglot services need a reliable data interchange, supported
across each language.

Within a distributed system of services having a reliable data interchange,
compatible across services, is of extreme importance. For this reason Remote
Procudure Call (RPC) frameworks are often employed. gRPC is an open source
Remote Procedure Call (RPC) framework enabling services to transparently
communicate over the HTTP/2 protocol. The advantage that HTTP/2 provides over
HTTP/1 is a constant TCP connection between endpoints enabling communication to
happen through streams. This mitigates the overhead of creating a TCP
connection for each and every request, furthermore allowing for multiplexing
the streams providing parallelism of requests over a single connection and thus
the potential of reduced network latency.

Whilst gRPC alone can be used to reliably transmit data across the wire it is
only part of the parcel. Akin to JSON, that is typically used to package
messages to and from an API, the serialisation solution offered by gRPC is that
of protocol buffers. I have covered protocol buffers in a [previous
post](/development/2017/09/13/protocol-buffers-and-optional-fields.html) but
what they offer in a word is structure.

Although building a JSON API is simple, there is an inherent risk of
breaking service consumers due to its lack of rigid structure. You can achieve
a variance of structure using a format such as OpenAPI, but it’s not a guarantee.

Protocol buffers promise a certain structure that will be sent without
exception.

Overall, we’re in the business to deliver value to our customers, not discuss
which JSON standard to use. JSON-API? HAL? Hypermedia at all (shivers)? We just
want to ship. gRPC lets us do that easily.

### Consistent Network Transport

A service mesh provides a language agnostic platform to automate network functions.
[envoy proxy](https://www.envoyproxy.io/)
