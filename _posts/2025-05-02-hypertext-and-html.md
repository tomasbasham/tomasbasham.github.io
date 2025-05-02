---
layout: post
title: 'HyperText and HTML: Why SPAs Are Dead'
description:
category: development
tags: development web htmx spa
---

In the first article of this series, I established my position that modern web
development has strayed from its roots, creating unnecessary complexity and
artificial divisions. Now, I want to focus specifically on how our industry's
obsession with client-side rendering and single-page applications (SPAs) has
undermined the very essence of the web: HyperText.

## How We Got Here

The rise of SPAs wasn't arbitrary. Around 2010-2015, several forces converged to
make them seem like the logical evolution of web development:

1. Smartphones created user expectations for app-like experiences
2. Browser APIs expanded dramatically, enabling more on the client
3. JavaScript engines became significantly faster
4. The desire to separate concerns led to API-driven architectures
5. Facebook's React introduced a compelling component model

For a time, these applications genuinely solved problems. They provided rich
interactions without full page reloads and helped teams scale by separating
frontend and backend concerns.

But in solving these problems, we created a host of new ones.

## The Price of Client-Side Rendering

The shift to SPAs brought substantial costs that many teams still don't fully
account for:

### Complexity

Let's be frank: modern frontend development is absurdly complex. Consider the
toolchain required to build even a simple React application:

- Webpack (or alternatives) for bundling
- Babel for transpilation
- State management libraries (Redux, MobX, Zustand, etc.)
- Routing libraries
- Form handling libraries
- Data fetching utilities
- Testing frameworks designed specifically for components
- CSS-in-JS solutions or complex styling approaches

Each of these tools is brilliant in isolation. Webpack, in particular, solves
genuinely hard problems. But collectively, they represent an extraordinary
amount of complexity — complexity that simply doesn't exist when rendering HTML
on the server.

### The JSON API Fallacy

Perhaps the most questionable pattern to emerge is what I call the "JSON API
fallacy": the belief that backends should primarily serve as JSON APIs, even
when they have exactly one consumer — the frontend of the same application.

Consider the typical flow in a React application:

1. Browser loads a minimal HTML shell
2. JavaScript loads and executes
3. JavaScript makes API requests to fetch data
4. JavaScript transforms that data into HTML
5. The user finally sees content

Compare this to server rendering:

1. Server processes request
2. Server generates complete HTML
3. Browser renders HTML immediately

The SPA approach introduces multiple round trips, client-side processing, and
numerous failure modes. All to accomplish what servers have done efficiently for
decades: transform data into HTML.

And for what benefit? "Decoupling," we're told. But is this decoupling actually
serving us?

### The Team Silo Problem

This architectural choice directly reinforces the frontend/backend divide I
criticised in the first article. With a JSON API between teams, we've
institutionalised a contract negotiation that must happen before work can
proceed.

The backend team builds and documents APIs, the frontend team consumes them, and
an enormous amount of communication overhead ensues. When requirements change
(as they inevitably do), this process repeats.

Is this really more efficient than having developers who understand both sides?

## HTMX: The Return to HyperText

Fortunately, we're seeing a renaissance of HyperText approaches led by libraries
like HTMX. What makes HTMX so compelling is its simplicity: it extends HTML
rather than replacing it.

Consider a typical HTMX interaction:

```html
<button hx-post="/submit" hx-target="#response-div">
  Submit
</button>
<div id="response-div"></div>
```

With just two attributes, we've created an asynchronous form submission that
updates a specific part of the page. No JSON transformation, no state
management, no virtual DOM — just HTML talking to HTML.

HTMX embraces what the web does best: exchanging HTML between client and server.
It provides:

- Partial page updates without full reloads
- History management and bookmarkable states
- Form validation and submission
- Dynamic content loading
- All with minimal JavaScript

This isn't a step backward — it's recognising that HTML was always the right
solution for document structure, and enhancing it for modern needs.

## The Case Against SPAs

With tools like HTMX available, it's increasingly difficult to justify SPAs for
most web applications. They make sense in specific contexts:

- Applications with significant offline requirements
- Highly interactive interfaces like design tools or games
- Situations where minimising server load is critical

But for the vast majority of CRUD applications, dashboards, content sites, and
e-commerce platforms? SPAs represent significant overengineering.

Consider these fundamental questions:

1. Why generate HTML on the client when servers are designed for this exact
   purpose?
2. Why create JSON APIs that will only ever have one consumer?
3. Why force users to download and execute megabytes of JavaScript before seeing
   content?
4. Why rebuild browser features like navigation and form handling in JavaScript?

## The Career Question

I anticipate pushback on this idea, largely because many developers have built
careers around frontend frameworks. There's a legitimate concern: if we simplify
our approach to web development, what happens to these specialised roles?

This concern reveals an uncomfortable truth: some of the complexity in our
industry exists to justify specialisation rather than to solve actual problems.

But I believe this fear is misplaced. Frontend development remains a critical
discipline even in a HyperText-centric world:

- Accessibility requires deep expertise
- Animation and micro-interactions demand specialisation
- Performance optimisation is increasingly important
- CSS layout and responsive design remain challenging
- Client-side interactivity still has its place

The difference is that frontend developers would focus on these genuinely hard
problems rather than reimplementing server rendering on the client.

## The Full Stack Future

Moving back toward HyperText doesn't diminish the role of frontend developers —
it elevates all developers to full-stack contributors. When the artificial
boundary between frontend and backend dissolves, engineers can:

- Make end-to-end changes without coordination overhead
- Understand the full impact of their changes
- Optimise the entire request/response cycle
- Create more coherent user experiences

This isn't just more efficient — it's more fulfilling work.

## Conclusion

SPAs had their moment, and for certain applications, they remain the right
choice. But for the vast majority of web projects, it's time to admit they've
created more problems than they've solved.

By returning to HyperText principles with modern tools like HTMX, we can:

- Simplify our development process
- Deliver faster initial page loads
- Improve accessibility and SEO
- Reduce development time and costs
- Create more cohesive teams

The future of web development doesn't look like ever more complex JavaScript
frameworks. It looks like HTML, enhanced with just enough dynamic behaviour to
meet modern expectations.

In the next article, I'll turn my attention to another area where modern
practices have arguably gone astray: CSS and the rise of utility-first
frameworks like Tailwind.
