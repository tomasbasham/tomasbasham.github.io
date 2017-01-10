---
layout: post
title: Git Renegade — Delete Remote Tags
description: How to delete remote tags from a git repository.
category: development
tags: development git github
---

This is not something considered best practice but if the need arises that a tag
must be removed from a remote repository server then here is how to delete it.

If you have a remote tag named `tag-name` it can be deleted with:

```bash
git tag -d tag-name
git push origin :refs/tags/tag-name
```

This will delete the tag both locally and remotely.
