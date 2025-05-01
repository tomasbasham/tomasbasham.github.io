---
layout: post
title: 'Web Development at a Crossroads: Returning to Fundamentals'
description:
category: development
tags: development web fundamentals javascript html
---

In this series of articles, I'll be challenging several sacred cows of modern
web development. Not because I enjoy being contrarian, but because I believe our
industry has veered dramatically off course — creating unnecessary complexity,
establishing counterproductive team structures, and moving further from the
foundational principles that made the web so revolutionary in the first place.

## What to Expect From This Series

These articles represent my opinions, formed through years of experience
watching the pendulum swing from server-rendered sites to JavaScript-heavy
client applications and the consequences that have followed. Over the coming
weeks, I'll examine:

1. How the overuse of JavaScript on the frontend has subverted sensible web
   practices
2. Why the artificial division between "frontend" and "backend" development is
   harmful
3. How hypertext and HTML still offer the most elegant solutions to many
   problems
4. Why co-location of markup, styling and behaviour creates tighter coupling and
   more problems than it solves

The goal isn't to throw out all modern practices — there are genuine innovations
worth preserving — but rather to challenge assumptions about how we build for
the web and propose simpler alternatives.

## The JavaScript Juggernaut

Let's begin with a provocative statement: most websites don't need the amount of
JavaScript they're shipping. Modern frontend development has convinced us that
nearly everything must be handled client-side, resulting in:

- Enormous bundle sizes that penalise users on slower connections
- Complex build pipelines that slow development cycles
- Accessibility issues that wouldn't exist with proper HTML
- SEO challenges requiring additional workarounds
- Reinvention of browser features that already work perfectly well

What began as a legitimate need for more interactive web experiences has turned
into an industry-wide assumption that JavaScript-first development is the only
viable approach to modern websites.

## The Great Divide: Frontend vs Backend

Perhaps the most damaging consequence of the JavaScript revolution has been the
artificial division of development teams into "frontend" and "backend" camps.
This split has:

- Created misaligned incentives where teams optimise for different, often
  competing goals
- Established dependencies between teams that slow delivery and create
  bottlenecks
- Developed specialisations so deep that engineers struggle to understand the
  whole system
- Fostered different cultures with different values (e.g., visual perfection vs
  system performance)

These silos don't serve productivity. Instead, they've institutionalised a
push-pull relationship that ultimately harms our products and our users.

At its core, this division ignores a fundamental truth: the web is a unified
medium, not two separate worlds that happen to connect via APIs.

## The Return to HyperText

Tim Berners-Lee's original vision for the web centred on hypertext — the idea
that documents could be interconnected through links, creating a web of
knowledge.  This elegantly simple concept remains powerful.

Modern alternatives like HTMX are demonstrating how we can return to hypertext
principles whilst still creating dynamic, responsive applications. By shifting
back towards traditional web development patterns, we can:

- Create more cohesive teams without artificial boundaries
- Simplify our technical architecture
- Reduce dependencies on complex build tooling
- Leverage browser capabilities rather than fighting them
- Put content and functionality first, rather than framework constraints

## The Problem with Colocating Everything

Another trend worth challenging is the practice of putting HTML, CSS, and
JavaScript in the same file. While this approach promises improved
maintainability through "components," it actually:

- Tightly couples presentation, behaviour, and markup
- Makes styling changes more difficult across the application
- Encourages the proliferation of inline styles and utility classes
- Creates duplication as similar components are recreated across the codebase
- Complicates the extraction of common patterns

Is the convenience worth these tradeoffs? I would argue not.

## Looking Ahead

In the coming articles, I'll delve deeper into each of these topics, examining
the current state of web development, how we got here, and where we might go
instead. I'll provide concrete alternatives and approaches that respect the
web's inherent nature whilst still delivering the experiences users expect.

This isn't about turning back the clock — it's about recognising that sometimes,
the best way forward is to revisit the fundamental principles that made
something successful in the first place.

If you've been feeling the weight of frontend complexity, the frustration of
team silos, or simply wondering if there's a better way to build for the web, I
hope you'll join me on this journey back to fundamentals.

Next up: HyperText and HTML — Why the Future Looks Like the Past
