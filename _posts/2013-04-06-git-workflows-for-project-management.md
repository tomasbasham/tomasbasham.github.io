---
layout: post
title: Git Workflows for Project Management
description: Basic Git workflow for project management.
category: development
tags: featured git project-management
---

This is how I use `git` either working as part of a team or individually.

I use an amend/rebase mutable-history workflow where each idea is always
represented by one commit. I never make checkpoint commits, and I only need to
write git commit messages once per feature (and perhaps amend them), and I never
merge into working branches. I have three git aliases:

- `wip` ("work in progress"): `git commit -a -m "chore: work in progress"`
- `amend`: `git commit --amend --no-edit`
- `force`: `git push --force`

To start a new change, I work in feature branches.

```bash
git checkout master
git checkout -b newfeature
vim somefile.js # make changes to existing file.
git wip
git push -u origin newfeature
```

To update a change, I amend it into HEAD.

```bash
vim somefile.js
git amend
git force
```

To start a new feature which depends on another feature, I branch off the
branch. I do this rarely.

```bash
git checkout newfeature
git checkout -b newerfeature
vim newfile.js # make changes to new file.
git add newfile.js
git wip
git force
```

To pull in other users' changes to a first-degree branch, I rebase. I do this
often to keep my branch up to date.

```bash
git checkout newfeature
git rebase master
```

To rebase an nth-degree branch, I cherry-pick. This is usually painless, while
using rebase often is not.

```bash
git checkout newerfeature
git show # copy commit hash
git reset --hard newfeature
git cherry-pick <hash>
```

Alternatively, I'll use `rebase -i`:

```bash
git checkout newerfeature
git rebase -i newfeature
```

In many cases, just deleting every commit from the interactive rebase except
HEAD results in a clean rebase.

To push a change, I use `git force`. This should only be done on feature
branches; never master.
