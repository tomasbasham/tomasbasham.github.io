---
layout: post
title: Arcanist Workflows for Project Management
description: Basic arcanist workflow for project management.
author: Tomas Basham
comments: true
category: Technology
tags: technology
---
This is how I use `arc` with Git.

I use an amend/rebase mutable-history workflow where each idea is always represented by one commit. I never make checkpoint commits, and I only need to write Git commit messages once per feature (and perhaps amend them), and I never merge. I have two shell aliases:

  - `wip`: ("work in progress") `git commit -a -m`
  - `squish`: `git status && git commit -a --amend -c HEAD`

I use TextMate to edit code. The `mate` commands below invoke the editor, although I usually locate and open files with GUI in the Finder.

To start a new change, I work in feature branches.


	$ git checkout develop
	$ git checkout -b newfeature
	$ mate somefile.php
	$ wip
	$ arc diff


To update a change, I amend it into HEAD.


	$ mate somefile.php
	$ squish
	$ arc diff


To start a new feature which depends on another feature, I branch off the branch. I do this rarely.


	$ git checkout newfeature
	$ git checkout -b newerfeature
	$ mate newfile.php
	$ wip
	$ arc diff newfeature


To pull in other users' changes to a first-degree branch, I rebase. I do this very rarely.


	$ git rebase develop


To rebase an nth-degree branch, I cherry-pick. This is usually painless, while using rebase often isn't.


	$ git checkout newerfeature
	$ git show # copy commit hash
	$ git reset --hard newfeature
	$ git cherry-pick <hash>


Alternatively, I'll use `rebase -i`:


	$ git checkout newerfeature
	$ git rebase -i newfeature


In many cases, just deleting every commit from the interactive rebase except HEAD results in a clean rebase.

To push a change, I use `arc land`:


	$ arc land


Facebook Workflow
-----------------

This is the major workflow used at Facebook with Git. It is similar to the "epriestley" workflow, but uses commit templates and `rebase -i` to handle Nth-degree branches. It uses "--verbatim" and makes commit messages authoritative. It does not use merges or checkpoint commits.

Set your Git commit template to the output of:


	echo '{"edit":"create"}' | arc call-conduit differential.getcommitmessage`


When you commit, fill out the template.

To start a new change, work in a feature branch:


	$ git checkout master
	$ git checkout -b newfeature
	$ vim file.php
	$ git commit # Fill out template
	$ arc diff --verbatim


To update a change, amend:


	$ vim file.php
	$ git commit --amend
	$ arc diff --verbatim


To start a feature which depends on another feature, stack the commits:


	$ vim file.php
	$ git commit # Fill out template
	$ arc diff --verbatim HEAD^


To edit the previous feature, use `rebase -i`:


	$ git rebase -i master
	# Now, pick "edit" for the commit you want to edit.


To rebase the stack, use `git rebase`:


	$ git rebase


Facebook pushes changes with `git svn dcommit` because its backing VCS is SVN. This is unusual.
