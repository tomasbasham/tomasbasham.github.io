---
layout: post
title: 'HyperText and HTML: Why SPAs Are Dead'
description: Why single-page applications solved real problems for a time, and why HTML plus HTMX now solves most of the same problems more simply.
category: development
tags: web htmx spa
series: web-fundamentals
---

The first article in this series set out my general complaint: that modern web
development defaults to client-side complexity for problems that don't need
it. This one is about the specific case of single-page applications, and about
why I think the pendulum is already swinging back, whether or not the industry
has noticed yet.

## Why SPAs happened

The rise of the SPA wasn't an accident or a fad. Around 2010–2015 several
things arrived at once: smartphones set an expectation for app-like
interaction, browser APIs matured enough to support it, JavaScript engines got
fast enough to make it tolerable, and React gave teams a component model that
solved a genuine organisational problem — how a dozen people work on one UI
without constantly colliding. For a while, these applications solved real
problems: rich interaction without full page reloads, and a clean separation
that let frontend and backend teams scale independently.

The costs took longer to show up than the benefits did.

## What it costs

Open the dependency tree of a moderately complex React application and you'll
typically find a bundler, a transpiler, a state management library, a router,
a form library, a data-fetching layer, and a component-testing framework —
each one solving a real problem in isolation, and each one adding to a stack
of complexity that doesn't exist at all when HTML is rendered on the server.
None of these tools are badly designed. The complexity isn't a bug in any one
of them; it's the sum of needing all of them at once to do what a server used
to do by itself.

The deeper issue is what I'd call the JSON API fallacy: the assumption that a
backend should serve JSON even when it has exactly one consumer, the frontend
of the same application. The typical SPA request looks like this — browser
loads a near-empty HTML shell, JavaScript executes, JavaScript fetches JSON,
JavaScript turns that JSON into HTML, and only then does the user see
anything. A server rendering the page directly skips three of those four
steps. The JSON step only earns its complexity when there's a second consumer
of the API — a mobile app, a third party — that actually needs it. Most
CRUD applications don't have one.

That fallacy also reinforces the frontend/backend split I mentioned in the
first article: a JSON API is a contract, and contracts have to be negotiated,
documented, and renegotiated every time the product changes. A team that
didn't need the contract in the first place doesn't pay that cost.

## What HTMX actually does

HTMX is interesting because it doesn't propose an alternative architecture —
it extends the one the browser already has.

```html
<button hx-post="/submit" hx-target="#response-div">
  Submit
</button>
<div id="response-div"></div>
```

Two attributes turn a button into an asynchronous form submission that
replaces the contents of a target element with whatever HTML the server
sends back. No JSON, no client-side templating, no state to keep in sync
between a store and the DOM — the server still owns the rendering, HTMX just
gives it a way to update part of a page instead of the whole thing. It's the
same request/response model the web has always had, with slightly finer
control over where the response lands.

## Where SPAs still make sense

I don't think this argument extends to every application. Offline-first
tools, design and drawing applications, games — anything where the state
genuinely lives on the client and the server is secondary — are legitimately
served by a client-heavy architecture. What I'm arguing against is the default,
not the exception: most dashboards, content sites, and CRUD applications
don't have offline requirements or client-side state worth the name, and
building them as SPAs anyway is solving a problem the project doesn't have.

## What this means for frontend work

The obvious objection is that a lot of careers are built on frontend
frameworks, and simplifying the default architecture threatens that. I think
this gets the causality backwards: some of the complexity in frontend
tooling exists because the specialisation needs defending, not because the
problems demand it. But that doesn't mean frontend expertise disappears —
accessibility, animation, layout, and genuinely interactive client-side
behaviour are still hard, specialist problems. What changes is that frontend
developers would be solving those problems instead of re-implementing server
rendering in the browser.

Pulling the architecture back toward hypertext doesn't shrink what frontend
developers do. It moves the boundary between frontend and backend from a
JSON contract to a shared page, which is the thread I'll pick back up in the
last article in this series, on team structure.

The next article is CSS, and specifically what utility-first frameworks like
Tailwind get right and where I think they go wrong.
