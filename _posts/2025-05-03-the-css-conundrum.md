---
layout: post
title: 'The CSS Conundrum: Why Utility Classes Are Not The Answer'
description: Utility-first CSS solved real problems with the cascade, but at the cost of the separation between structure and presentation.
category: development
tags: css tailwindcss
series: web-fundamentals
---

The previous two articles in this series argued for pulling web development
back toward hypertext and away from unnecessary client-side architecture. This
one covers a parallel trend in styling: the rise of utility-first CSS,
TailwindCSS in particular, and the broader habit of embedding presentation
directly in markup.

## The problems Tailwind actually solves

Traditional CSS has real failure modes, and it's worth naming them honestly
before arguing against the fix. Selectors are globally scoped, so two
developers can collide on a class name without realising it. The cascade,
useful as it is, makes it easy to produce specificity fights nobody can trace
back to their source. Large stylesheets accumulate dead rules nobody's
confident enough to delete. Utility-first frameworks solve all of this by
sidestepping it: a class like `bg-blue-500` can never collide, can never be
overridden unexpectedly, and is either used on the page or it isn't.

That's a real trade, not a fake one. The question is what you give up to make it.

## What gets lost

Compare these two versions of the same component:

```html
<div class="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md">
  <div class="flex items-center mb-4 md:mb-0">
    <img class="w-10 h-10 rounded-full mr-4" src="avatar.jpg" alt="User avatar">
    <div>
      <h3 class="text-lg font-medium text-gray-900">User Name</h3>
      <p class="text-sm text-gray-500">User Title</p>
    </div>
  </div>
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Follow
  </button>
</div>
```

```html
<div class="user-card">
  <div class="user-profile">
    <img class="avatar" src="avatar.jpg" alt="User avatar">
    <div class="user-info">
      <h3 class="name">User Name</h3>
      <p class="title">User Title</p>
    </div>
  </div>
  <button class="follow-button">Follow</button>
</div>
```

The first tells you nothing about what the component is until you've parsed
every class on every element. The second tells you in one glance: a user
card, with a profile and a follow button. That's not a style preference —
semantic markup is supposed to describe structure, and the utility-class
version has given that job up entirely in exchange for the collision-safety
described above.

The maintainability cost follows from the same trade. If a design system
decision changes — say, standard button padding — the semantic version
changes one rule. The utility version means grepping every file that
happens to use that combination of classes and hoping you found them all.
Responsive variants make this worse before they make it better: `md:flex-row`
and `md:mb-0` scattered through markup is exactly the kind of noise that
semantic class names were invented to hide.

The usual justification is colocation — keeping everything about a component
in one file so there's nowhere else to look. But colocation and coupling are
the same thing described from two different angles. Keeping style and markup
in one file doesn't eliminate the need for consistency, it just means every
place that needs it has to restate it, which is worse for consistency, not
better.

## What CSS was actually for

The cascade, inheritance, and specificity exist to let presentation be
defined once and applied broadly, and to let it change in one place when the
underlying intent changes. That's not an accident of the spec; it's the
reason it's called Cascading Style Sheets rather than Per-Element Style
Attributes. Utility classes don't improve on that model — they opt out of it,
in favour of a programmatic style closer to inline styling, dressed up as
classes.

## Where I'd actually land

None of this is an argument for the stylesheet chaos that made Tailwind
attractive in the first place. CSS Modules give you real scoping without the
global-namespace risk. Sass or plain CSS with sensible partials and variables
give you the cascade back without reintroducing the collision problem. CSS
custom properties cover most of what people reach for a JavaScript-driven
design-token system to do. BEM, applied with some discipline, gives markup
back its semantics while still keeping class names predictable. All four
solve the real problems that made utility classes look necessary, without
giving up what semantic HTML and the cascade are for.

The next article in this series moves from CSS to a principle that both of
the previous two implicitly depend on: progressive enhancement, and why
building up from working HTML is still the right default even when a page
ends up fully interactive.
