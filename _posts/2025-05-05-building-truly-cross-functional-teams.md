---
layout: post
title: 'Building Truly Cross-Functional Teams: Beyond the Frontend-Backend Divide'
description: The technical arguments earlier in this series point at an organisational one — that the frontend/backend split costs more than it buys once the technical gap it was defending narrows.
category: career
tags: teams cross-functional
series: web-fundamentals
---

The rest of this series has been about technical defaults: client-side
architecture, utility-first CSS, progressive enhancement. None of those
choices are made in a vacuum — they both shape and get shaped by how teams
are organised. This last article is about the organisational side: the
frontend/backend split, why it hardened into something closer to a
permanent structure than a practical division of labour, and whether it's
still worth what it costs.

## Why the split happened

The split had legitimate origins. Early browsers were inconsistent enough
that cross-browser CSS and JavaScript were genuinely specialist knowledge.
Backend systems carried real complexity of their own — databases,
transactions, business logic. The full stack, in the early days, was large
enough that very few people could hold all of it well at once. Specialising
made sense.

What's changed isn't that the stack got smaller. It's that the gap between
"frontend" and "backend" skill, for most applications, has narrowed
considerably — partly because the technical choices argued for earlier in
this series (server-rendered HTML, HTMX instead of a bespoke client
framework, CSS that doesn't require a build step to reason about) reduce how
much there is to specialise in on either side.

## What the split actually costs

A JSON API between two teams is a contract, and every contract has to be
negotiated, documented, and renegotiated whenever requirements change —
which, on any live product, is constantly. I've sat in meetings discussing
the shape of an API that would have taken less time to simply build, had one
person been able to see the whole path from request to rendered page.

The split also sets up two teams to optimise for different things by
default: a frontend team under pressure to ship visual polish, a backend
team under pressure to protect data integrity and system reliability. Both
are legitimate priorities. Split across two teams with two reporting lines
and two sets of metrics, they stop being complementary and start being
competing, not because the priorities are actually in conflict, but because
nobody on either side is accountable for reconciling them.

The subtler cost is what it implies about who's allowed to know what. Once
"frontend" and "backend" become job titles rather than areas of emphasis,
developers are discouraged from learning past the boundary, features can't
be shipped end-to-end by one person, and context gets lost every time work
crosses the line between teams. None of this is because the underlying
material is actually too hard to learn across — most of software
engineering's ideas transfer across the boundary just fine. It's an
organisational habit, not a cognitive limit.

## What I'd build instead

A cross-functional team, in the sense I mean it, isn't a frontend developer
and a backend developer sat at the same desk. It's a team that owns features
end-to-end, where most members have both some depth and some breadth —
T-shaped, in the usual phrase — and where specialisation, where it exists,
is contextual rather than a permanent label. The team is organised around a
business domain, not a technical layer, which matters because it's domains,
not layers, that actually change when the product changes.

The technical choices from earlier in this series make this easier to
sustain, not just philosophically compatible with it. Server-rendered HTML
with HTMX narrows the actual skill gap between "frontend" and "backend"
work. CSS without a utility-class compiler step is something any team member
can safely touch. Progressive enhancement creates a natural layering —
HTML, then CSS, then JavaScript — that maps cleanly onto how much depth a
given change actually needs, rather than requiring every change to pass
through a framework-shaped lens regardless of its size.

## The objections worth taking seriously

The strongest counter-argument is that specialists are more efficient at
narrowly defined tasks, which is true, but it undercounts the coordination
cost of getting two specialists' narrow work to meet in the middle. A
slightly slower generalist who ships a feature end-to-end is often faster,
measured from idea to production, than two specialists who are individually
faster but have to synchronise.

The second objection — that full-stack developers capable of this are rare
— is real but somewhat self-inflicted. Narrow job descriptions and
permanently separated teams actively discourage people from building the
breadth this model needs. Hiring and structuring for it is a longer-term fix
than hiring around it, but it's the one that actually closes the gap rather
than permanently working around it.

The third is that some developers genuinely prefer to specialise, which I
don't think this model denies anyone. A CSS specialist on a cross-functional
team is still a specialist; the difference is that their work stays
connected to the rest of the feature because the team, not an API boundary,
is the unit of ownership.

## Where this series lands

Across these five articles the thread has been the same: start from the
primitive that already solves the problem — HTML, HTTP, the cascade — and
add complexity only where it's actually earned. Technically, that means
favouring hypertext over bespoke client architecture, favouring the cascade
over utility classes, and favouring progressive enhancement over
JavaScript-first defaults. Organisationally, it means the frontend/backend
split is worth questioning for the same reason: it was the right answer to a
technical gap that, for a lot of applications, no longer exists at the size
it used to.
