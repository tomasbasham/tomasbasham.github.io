---
layout: post
title: Git Workflows for Project Management
description: Basic Git workflow for project management.
category: Development
tags: featured development git management
---
This is how I use `git` either working as part of a team or individually.

I use an amend/rebase mutable-history workflow where each idea is always
represented by one commit. I never make checkpoint commits, and I only need to
write git commit messages once per feature (and perhaps amend them), and I
never merge. I have two git aliases:

* `wip`: ("work in progress") `git commit -a -m`
* `squish`: `git status && git commit -a --amend -c HEAD`
* `force`: `git push --force`

To start a new change, I work in feature branches.

{% highlight bash %}
  $ git checkout develop
  $ git checkout -b newfeature
  $ vim somefile.js
  $ wip
  $ git force
{% endhighlight %}

To update a change, I amend it into HEAD.

{% highlight bash %}
  $ vim somefile.js
  $ squish
  $ git force
{% endhighlight %}

To start a new feature which depends on another feature, I branch off the
branch. I do this rarely.

{% highlight bash %}
  $ git checkout newfeature
  $ git checkout -b newerfeature
  $ vim newfile.js
  $ wip
  $ git force
{% endhighlight %}

To pull in other users' changes to a first-degree branch, I rebase. I do this
often to keep my branch up to date.

{% highlight bash %}
  $ git rebase develop
{% endhighlight %}

To rebase an nth-degree branch, I cherry-pick. This is usually painless, while
using rebase often is not.

{% highlight bash %}
  $ git checkout newerfeature
  $ git show # copy commit hash
  $ git reset --hard newfeature
  $ git cherry-pick <hash>
{% endhighlight %}

Alternatively, I'll use `rebase -i`:

{% highlight bash %}
  $ git checkout newerfeature
  $ git rebase -i newfeature
{% endhighlight %}

In many cases, just deleting every commit from the interactive rebase except
HEAD results in a clean rebase.

To push a change, I use `git force`. This should only be done on feature
branches; never develop.
