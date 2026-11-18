---
layout: post
title: Why I Went Back to Operations
description: I finished a machine learning course, enjoyed it, and then found myself drifting back towards operations. The reasons were mundane, and one of them was pizza.
category: career
tags: machine-learning devops operations
---

I have just finished [writing up]({% post_url 2018-10-01-identifying-fraud-from-public-enron-data %})
the machine learning course project I spent the end of last year on, with the
[hyperparameter tuning]({% post_url 2019-02-28-hyperparameter-tuning %}) post
as the last of the series. I had been interested in machine learning since
around 2015, and the project was a good excuse to do it properly: clean a real
dataset, engineer features, choose a metric, validate honestly, tune. I enjoyed
all of it, and I am not going to carry on with it.

## It wasn't one thing

I would like to offer a dramatic reason, and I don't have one. The recent
excitement around larger models had nothing to do with it; they were not
advanced enough to be the cause. The honest answer is that machine learning sat
outside the skills I use every day, and outside anything my work required of me
on a daily basis. Whatever I learned would have to be kept alive in my spare
time, and a skill that is kept alive only in spare time tends to lose to
whatever has a reason to be used at work.

## Where I drifted instead

I drifted back to operations, which had been having an unusually good few
years. Every few months a new piece of tooling arrived that made some part of
running software better, and the landscape was improving in a way that was hard
to ignore. I had already written about [Kubernetes
networking]({% post_url 2017-06-30-kubernetes-networking %}) and about [building
services]({% post_url 2018-07-12-building-a-cloud-native-service %}) to run on
it, and those posts were never a detour from the Enron series. They were the
thing I was actually keen on.

I had also been going to a lot of meetups in London, and the talks that stuck
were about how these tools were improving velocity: how quickly a change could
get from a laptop to production, and how safely. I find that problem
fascinating, because the answer is visible. Either the change arrives or it
doesn't, and the system tells you which. There was also a lot of free pizza,
which I will not pretend was irrelevant.

## What the course left behind

I do not regret the detour. The discipline of asking what a number actually
measures, and of refusing to trust a result tested on the same data used to
produce it, transfers to any system you want to reason about. I would rather
have done the project than not.

I am going back to operations, and I am not planning to apologise to the
classifiers.
