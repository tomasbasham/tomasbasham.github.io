---
layout: post
title: 'Progressive Enhancement in the Modern Web: Building Resilient Applications'
description: Progressive enhancement is unfashionable, but starting from working HTML and layering on JavaScript still produces more resilient applications.
category: development
tags: javascript htmx alpinejs progressive-enhancement
series: web-fundamentals
---

The previous two articles argued against defaults — client-heavy
architecture, utility-first styling — that trade a foundation for
convenience. This one is about the principle that, in my view, should have
stayed the default all along: progressive enhancement.

## What it actually means

Progressive enhancement starts with semantic HTML that works with nothing
else, adds CSS to make it look right, and adds JavaScript last, to make it
behave better. The point isn't nostalgia for simpler interfaces — it's that
if any layer fails to load, the layer beneath it still works. A page built
this way degrades; a page built JavaScript-first, with HTML as an
afterthought generated at runtime, doesn't degrade, it just breaks.

## A search box, built up in layers

Start with a form that needs nothing but HTTP:

```html
<form action="/search" method="get">
  <label for="search">Search:</label>
  <input type="search" id="search" name="q">
  <button type="submit">Search</button>
</form>
```

This works everywhere, is indexable, and needs no explanation. Now add
autocomplete with HTMX and Alpine:

```html
<form action="/search" method="get">
  <label for="search">Search:</label>
  <input
    type="search"
    id="search"
    name="q"
    hx-get="/api/suggestions"
    hx-trigger="keyup delay:500ms"
    hx-target="#suggestions"
    x-data="{ query: '' }"
    x-model="query"
  >
  <button type="submit">Search</button>
  <div id="suggestions"></div>
</form>
```

Every keystroke now fires a debounced request to `/api/suggestions`, and the
response fills the suggestions div. Crucially, if that endpoint is slow,
broken, or the HTMX script fails to load entirely, the form hasn't lost
anything — it still submits, the server still returns results, the user
still searches. Autocomplete was added, not substituted for the thing it's
enhancing.

Pushing further with `hx-boost`:

```html
<form action="/search" method="get" hx-boost="true">
  <label for="search">Search:</label>
  <input
    type="search"
    id="search"
    name="q"
    hx-get="/api/suggestions"
    hx-trigger="keyup delay:500ms"
    hx-target="#suggestions"
    x-data="{ query: '' }"
    x-model="query"
    hx-indicator=".spinner"
  >
  <button type="submit">Search</button>
  <div class="spinner" style="display:none;">Loading...</div>
  <div id="suggestions"></div>
</form>
```

Now even the form submission itself avoids a full page reload. The same
guarantee holds: strip away HTMX and the form reverts to the plain version a
few paragraphs up, not to nothing.

## Why this still matters when "everyone has JavaScript"

The usual objection is that JavaScript failure is a theoretical concern —
practically every visitor has it enabled. That's beside the point. Scripts
fail to load over flaky mobile connections, get mangled by corporate
proxies, collide with browser extensions, or simply throw on a browser
nobody tested against. Progressive enhancement isn't about supporting
JavaScript-disabled browsers; it's about not betting the entire interface on
a layer that fails for ordinary, unglamorous reasons on a long enough tail of
requests.

It's also not slower to build, in my experience — it's slower to build
badly, the first time, because it forces you to settle what the feature
actually does before deciding how to make it nicer. Teams that skip that step
end up debugging edge cases in the JavaScript layer that wouldn't exist if
the HTML layer had been made to work first.

## HTML and HTTP already do most of this

Forms, links, and the full range of HTTP methods are underused primitives.
A plain `<form>` gives you validation, keyboard navigation, accessibility,
and autofill for free; a plain `<a>` gives you history, middle-click,
right-click, and keyboard navigation for free. HTMX's contribution isn't
replacing these — it's extending them to methods HTML forms don't natively
support:

```html
<button hx-delete="/items/1" hx-target="#items-list">
  Delete Item
</button>
```

That's still a request/response cycle against a URL; HTMX just lets the
button issue a `DELETE` instead of forcing the page through a form that only
understands `GET` and `POST`.

Alpine fills a similar, smaller role for purely client-side state:

```html
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open">Content</div>
</div>
```

If Alpine fails to load here, the content is still visible — it just won't
toggle. That's the whole philosophy in miniature: enhancement that fails
safe.

## Where progressive enhancement still meets resistance

The strongest version of the complaint is that modern applications are too
complex for this approach to scale. I don't think that holds up — GitHub is
not a simple application and is built this way extensively — but it's worth
taking seriously rather than dismissing outright, because some interactions
genuinely are client-state-heavy enough that layering doesn't make sense (a
drawing tool, a live collaborative editor). What's true for most
applications, though, including most of what gets built as a SPA by
default, is that they're forms and data display, which is precisely the
problem HTML was built to solve.

Progressive enhancement, utility-first CSS's alternatives, and the case
against SPAs by default all point the same direction: start from the
primitive that already does the job, and add only what genuinely improves on
it. The last article in this series asks what that means for how teams are
structured around this work — specifically, whether the frontend/backend
split still earns its cost once the technical gap between the two narrows.
