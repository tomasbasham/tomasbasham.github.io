---
layout: post
title: Git Renegade - Delete Remote Tags
description: How to delete remote tags from a git repository.
category: Development
tags: development git github
---
This is not something considered best practice but if the need arises that a
tag must be removed from a remote repository server then here is how to delete
it.

If you have a remote tag named `branch-name` it can be deleted with:

{% highlight bash %}
$ git tag -d branch-name
$ git push origin :refs/tags/branch-name
{% endhighlight %}

This will delete the tag both locally and remotely.
