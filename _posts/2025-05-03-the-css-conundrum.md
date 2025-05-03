---
layout: post
title: 'The CSS Conundrum: Why Utility Classes Are Not The Answer'
description:
category: development
tags: development css tailwindcss
---

In the previous articles in this series, I've examined how modern web
development has drifted from its foundational principles and advocated for a
return to HyperText. Now it's time to address another concerning trend: the
proliferation of utility-first CSS frameworks, particularly TailwindCSS, and the
practice of embedding styling directly within component markup.

## The Rise of Utility Classes

The popularity of utility-first CSS frameworks didn't emerge from nowhere.
Traditional CSS approaches presented genuine challenges:

1. Global scope leading to specificity conflicts
2. The cascade creating unexpected side effects
3. Difficulty in maintaining large stylesheets
4. Challenges in creating reusable styles

These were legitimate problems that needed solving. But as with JavaScript
frameworks, I would argue that the solution has introduced more problems than it
solved.

## The TailwindCSS Phenomenon

TailwindCSS has become extraordinarily popular, particularly among developers
working with component-based frameworks. The premise is straightforward: rather
than creating semantic class names that describe the element's purpose, you
apply tiny single-purpose utility classes directly to your HTML elements:

```html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</button>
```

Proponents argue this approach:

1. Eliminates the need to context-switch between HTML and CSS files
2. Reduces the risk of unused CSS accumulating
3. Makes it easy to understand exactly what styles are applied
4. Enables rapid prototyping and consistent design

At first glance, these benefits seem compelling. But they come at significant
costs.

## The Problems with Utility Classes

### Readability and Semantics

HTML was designed to be semantic — to convey meaning about content
structure. CSS was designed to separate presentation from that
structure. Utility classes fundamentally break this separation, resulting in
markup like this:

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

What is this component? A user card? A comment? A notification? The HTML
provides no semantic clues because it's overwhelmed with presentation details.

Compare this to semantic HTML with separate CSS:

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

The second example clearly communicates what each element represents. A
developer can immediately understand the component's purpose without needing to
mentally parse dozens of utility classes.

### Maintainability

While component-based frameworks mitigate some of the maintainability issues,
utility classes create new ones:

1. **Changes require markup updates across many files**: If your design system
   changes (e.g., standard button padding increases), you must update every
   component rather than changing one CSS rule.

2. **Responsive designs become unwieldy**: Notice the `md:flex-row` and
   `md:mb-0` classes in the example. As breakpoints multiply, these conditional
   classes create significant visual noise.

3. **Duplication abounds**: The same combinations of utility classes appear
   repeatedly throughout the codebase, often with subtle variations that create
   inconsistency.

### The False Promise of Colocation

Utility-first approaches are often justified by the desire to keep everything
related to a component in one file. But this "colocation" actually creates
tighter coupling and makes systemic changes more difficult.

When styling is embedded directly in markup:

1. **Global styling changes become nearly impossible**: There's no single place
   to update a component style across the application.

2. **Design system consistency suffers**: Even with disciplined developers,
   variations inevitably creep in when styles are repeated rather than
   referenced.

3. **The cascade — one of CSS's most powerful features — is nullified**: Instead
   of leveraging inheritance, styles are explicitly repeated at every level.

## The Spirit of CSS

To understand why utility classes represent such a departure, we need to revisit
CSS's core principles:

1. **Separation of concerns**: CSS was explicitly designed to separate
   presentation from content, allowing each to evolve independently.

2. **The cascade**: The "C" in CSS stands for "Cascading," allowing styles to
   flow through the document tree and be selectively overridden.

3. **Inheritance**: Child elements inherit properties from their parents,
   reducing repetition and creating visual consistency.

4. **Specificity**: A sophisticated system for resolving competing style rules
   based on selector types.

Utility classes effectively abandon these principles in favour of a more
programmatic, inline approach to styling. This isn't enhancing CSS — it's
replacing it with a fundamentally different paradigm.

## A More Balanced Approach

I'm not suggesting we return to massive global stylesheets with selector
specificity wars. But there are better alternatives than saturating our markup
with utility classes:

1. **CSS Modules**: Scoped CSS files that eliminate global namespace concerns
   whilst maintaining the separation of concerns.

2. **SASS/SCSS with sensible organization**: Preprocessors with partials,
   variables, and mixins provide modularity without abandoning CSS principles.

3. **Custom Properties (CSS Variables)**: Modern CSS includes powerful variable
   capabilities that enable consistent design tokens.

4. **Well-structured BEM methodology**: The Block-Element-Modifier pattern
   creates namespaced classes that clearly communicate component structure.

These approaches maintain the separation of concerns whilst addressing the
legitimate problems that led to utility-first CSS.

## Conclusion

The web was built on the principle that content, presentation, and behaviour
should be separate concerns. HTML provides structure, CSS provides presentation,
and JavaScript provides behaviour. This separation isn't arbitrary — it allows
each layer to evolve independently and excel at its primary purpose.

Utility-first CSS frameworks like Tailwind, encouraged by component-based
JavaScript frameworks, have blurred these boundaries, embedding presentation
deeply into content markup. While this approach may offer short-term convenience
for individual developers, it creates long-term maintainability problems and
undermines the web's fundamental architecture.

Like the overuse of JavaScript and the artificial division between frontend and
backend, the proliferation of utility classes represents another way our
industry has drifted from the web's foundational principles.

In the next article, I'll explore potential topics like accessible progressive
enhancement, the return of server-side rendering with frameworks like Phoenix
LiveView and Laravel Livewire, or the evolving role of JavaScript in a
HyperText-centric world. I welcome your feedback on which direction would be
most valuable to explore.
