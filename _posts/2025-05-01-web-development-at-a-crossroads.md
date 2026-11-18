---
layout: post
title: 'Web Development at a Crossroads: Returning to Fundamentals'
description: The first in a series arguing that web development has drifted from the fundamentals that made the web work, and proposing a way back.
category: development
tags: web htmx fundamentals
series: web-fundamentals
---

I've spent the last few years watching the pendulum swing from server-rendered
sites to JavaScript-heavy client applications, and I think we've gone too far.
Not because JavaScript is bad, or because single-page applications are never the
right tool, but because we've made them the default for problems they were
never suited to, and in doing so we've built an industry around solving problems
of our own making.

This is the first in a short series setting out where I think things went wrong
and what I'd do differently. The topics, roughly in order:

- how the assumption that everything belongs on the client has produced
  needless complexity
- why hypertext — plain old links and forms — still solves most of what people
  reach for a framework to solve
- why utility-first CSS trades one set of real problems for another, worse set
- why progressive enhancement, unfashionable as it's become, is still the right
  default
- how all of this bears on team structure, and the frontend/backend split in
  particular

None of this is a case for throwing out modern tooling. Some of it is genuinely
good. It's a case for being honest about what problems we're actually solving
when we reach for it.

## The cost nobody adds up

Most websites don't need the JavaScript they're shipping. I don't mean this as
a provocation — I mean it as an observation anyone can check by opening the
network tab on a content site, a dashboard, or a CRUD application and counting
the megabytes spent re-implementing things the browser already does for free:
navigation, form submission, caching. Bundle size is the most visible cost, but
not the worst one. Build pipelines that take minutes to iterate against, test
suites that have to mock a DOM to run, accessibility bugs that wouldn't exist
if the markup were doing the job markup is for — these are the ongoing costs,
paid by every developer who touches the codebase after the framework decision
was made.

None of this was unreasonable when it started. Browsers genuinely were
inconsistent, interactivity genuinely was hard to bolt onto static pages, and
component models genuinely solved a real organisational problem: how do you let
many people work on one UI without stepping on each other. The problem is that
the industry kept the solution long after a large fraction of the sites built
with it stopped needing what it was solving for.

## The frontend/backend split

The clearest organisational symptom of this is the hardening of "frontend" and
"backend" into separate disciplines, separate teams, and often separate
reporting lines. This wasn't always how the web was built, and I don't think
it's how most of it should be built now.

The split isn't free. It creates a contract — usually a JSON API — that has to
be negotiated, documented, and renegotiated every time requirements change, and
every renegotiation is a meeting that wouldn't have been necessary if one
person could see the whole path from request to rendered page. It also
encourages two different teams to optimise for two different things: visual
polish on one side, system correctness on the other, both legitimate, both
avoidably in tension when there's an API boundary enforcing the separation.

I'll come back to this properly in the last article in this series, because I
think it's a consequence of the technical choices more than a cause of them.

## Hypertext didn't go anywhere

The thing I keep returning to is that the web's original idea — documents
linked to other documents, forms that submit to a server which sends back more
document — never stopped working. It just stopped being fashionable. Libraries
like HTMX are interesting precisely because they don't try to replace this idea
with something else; they extend it, letting an element trigger a request and
swap in the response, which is what a browser already does when you click a
link, just with a bit more control over the target.

I'll go through what that looks like concretely in the next article.

## Styling and markup don't have to live in the same place

The other trend worth naming here, which I'll cover separately, is co-locating
HTML, CSS and JavaScript in the name of "component" ergonomics. It solves a
real discoverability problem — where is the style for this thing — at the cost
of a worse one: styles that can no longer be changed in one place, because
they're no longer in one place. I don't think that trade is usually worth it,
and I'll explain why when I get to CSS specifically.

That's the shape of what's coming. The next article starts with hypertext,
since it's the foundation the rest of the argument rests on.
