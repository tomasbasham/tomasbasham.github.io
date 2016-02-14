---
layout: post
title: Git Workflows for Project Management
description: Basic Git workflow for project management.
author: Tomas Basham
comments: true
category: Technology
tags: featured technology git management
---
This is how I use `git` either working as part of a team or individually.

I use an amend/rebase mutable-history workflow where each idea is always represented by one commit. I never make checkpoint commits, and I only need to write git commit messages once per feature (and perhaps amend them), and I never merge. I have two git aliases:

* `wip`: ("work in progress") `git commit -a -m`
* `squish`: `git status && git commit -a --amend -c HEAD`
* `force`: `git push --force`

I use TextMate to edit code. The `mate` commands below invokes the editor, although I usually locate and open files with GUI in the Finder.

To start a new change, I work in feature branches.

    $ git checkout develop
    $ git checkout -b newfeature
    $ mate somefile.js
    $ wip
    $ git force

To update a change, I amend it into HEAD.

    $ mate somefile.js
    $ squish
    $ git force

To start a new feature which depends on another feature, I branch off the branch. I do this rarely.

    $ git checkout newfeature
    $ git checkout -b newerfeature
    $ mate newfile.js
    $ wip
    $ git force

To pull in other users' changes to a first-degree branch, I rebase. I do this often to keep my branch up to date.

    $ git rebase develop

To rebase an nth-degree branch, I cherry-pick. This is usually painless, while using rebase often is not.

    $ git checkout newerfeature
    $ git show # copy commit hash
    $ git reset --hard newfeature
    $ git cherry-pick <hash>

Alternatively, I'll use `rebase -i`:

    $ git checkout newerfeature
    $ git rebase -i newfeature

In many cases, just deleting every commit from the interactive rebase except HEAD results in a clean rebase.

To push a change, I use `git force`. This should only be done on feature branches; never develop.
