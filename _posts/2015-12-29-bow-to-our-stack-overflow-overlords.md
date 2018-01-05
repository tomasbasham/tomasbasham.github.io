---
layout: post
title: Bow to our Stack Overflow Overlords
description: The pretentious nature of the largest programming Q&A monster.
author: Tomas Basham
comments: true
category: Development
tags: development
---
I have used Stack Overflow now for many years and it saves my bacon on a daily
basis. I use to regard it as a wondrous place where developers can share ideas
and pose questions, however I feel more and more that Stack Overflow has
mutated into a monstrous Q&A machine.

The conflict that Stack Overflow faces is that it seems uninterested in users
getting answers for their usually well formed and coherent questions but
prefers to house the "**best**" and most grammatically correct questions and
answers the internet has to offer.

If a question is considered poor by a user with moderating privileges, it will
be downvoted, closed and finally deleted. On top of this users providing
questions and answers that receive low marks can be banned by robots. This
pretentious, opinionated community demonstrates an online society where the
rich (those with high reputation) remain rich (or get richer) whilst the poor
remain poor and are subsequently judged, often harshly, by those with greater
power.

An example of a question I recently asked on Stack Overflow was:

>### Merge similar Ruby array elements together
>
>I have an array of objects in Ruby where some of the objects share the same
>keys. I was wondering if there is already a method on the Array object that
>could flatten/merge this array into something more compact. If not I'll just
>have to write my own method.
>
>For example I have an array:
>
>     [
>       { "match": { "properties.name": "name1" } },
>       { "range": { "properties.price": { "gte": 50 } } },
>       { "range": { "properties.price": { "lte": 100 } } }
>     ]
>
>and I would like to flatten/merge it such that it looks like this:
>
>     [
>       { "match": { "properties.name": "name1" } },
>       { "range": { "properties.price": { "gte": 50, "lte": 100 } } }
>     ]

I felt this was a perfectly clear question with a coherent expected outcome.
After all I was really only asking for some advice from somebody more familiar
with Ruby to tell me whether I would have to write my own method to achieve my
desired result; because who wants to waste time writing something themselves if
it already exists as a language feature, right?

A Ruby Guru comes along to take a look at my question. This guy was the bees
knees: 88K reputation on Stack Overflow with 93% of his posts within the Ruby
category. Surely this guy could answer my question with ease. Instead he
proceeds to edit my post as such:

> ### Merge similar <strike>Ruby</strike> array elements together
>
> I have an array of <strike>objects in Ruby where</strike> **objects**, some
> of <strike>the objects</strike> **which** share the same keys. I was
> wondering if there is already a method on <strike>the Array object
> that</strike> **Array that** could flatten/merge this array into something
> more compact. If not, I'll just have to write my own method.
>
> For example, I have an array:
>
>     [
>       { "match": { "properties.name": "name1" } },
>       { "range": { "properties.price": { "gte": 50 } } },
>       { "range": { "properties.price": { "lte": 100 } } }
>     ]
>
> and I would like to flatten/merge it such that it looks like this:
>
>     [
>       { "match": { "properties.name": "name1" } },
>       { "range": { "properties.price": { "gte": 50, "lte": 100 } } }
>     ]

Not only has this user not read the question properly, he has presumed that he
knows best and abused his moderation privileges to edit the question thus
removing the entire purpose of the question. I specifically wanted this problem
solved in Ruby and wanted to know if there was any method on the Array object
(in **Ruby**) that could accommodate my need. His edits have consequently made
the question far too generic to be helpful. He continues to then close my
question, marking it as "unclear, incomplete, overly-broad, primarily
opinion-based or is not about programming...". Far too many question are being
closed for this largely subjective opinion.

At least he didn't downvote me!
