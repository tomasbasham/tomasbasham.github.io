---
layout: post
title: Full Stack, Revisited
description: I once argued that full-stack should include operations. I still like the culture behind DevOps, but I now think the better answer is putting operations expertise next to delivery teams rather than inside them.
category: career
tags: devops platform-engineering engineering-culture
---

In 2017 I [argued]({% post_url 2017-04-18-the-new-full-stack-developer %}) that
the definition of a full-stack developer should be expanded to include
operations. Some experience with servers and deployment, I said, should be
essential, and it should be the developer's responsibility to deploy and
maintain their code from conception to production. I was reading the same job
adverts as everyone else and extrapolating from where DevOps culture was going.

I no longer hold that view, and it is worth saying exactly which part I have
dropped. The culture was right. The conclusion I drew from it was not.

## What DevOps got right

Separating the people who write software from the people who run it creates a
wall, and walls are where problems go to wait. A delivery team that never sees
how its code behaves in production makes different decisions from one that
does, and an operations team that is consulted only at release time can only say
no. Tearing that wall down was the correct instinct, and I still hold it.

## What I got wrong

I assumed the way to remove the wall was for engineers to absorb the operations
role. That quietly assumes operations is a skill you can add to a developer's
existing load, when in practice it is a deep discipline with its own body of
knowledge. The [complexity that cloud-native
tooling moved around]({% post_url 2020-11-16-complexity-doesnt-disappear-it-moves %})
did not go away when it moved. Someone still has to understand it well enough to
decide what to adopt, how to bound the damage when it fails, and when to leave
it alone. Asking every delivery team to do that on top of delivering is how you
get teams that are mediocre at both.

There is also a quieter cost. A team that owns its operations alone owns it
differently every time, so the organisation ends up with as many answers to
"how do we deploy" as it has teams.

## The version I believe now

The wall comes down fastest when operations and infrastructure expertise sits
next to delivery early, rather than at the end of the process or inside every
team. That means those experts are involved while decisions are still cheap,
and delivery teams still keep ownership of what they build and run.

Platform engineering is the form of this that I find most convincing. A
platform team sits between operations and delivery as a buffer, taking the
specialist knowledge and turning it into something delivery teams can consume
without needing to hold all of it. Done well, it gives teams autonomy within
boundaries someone else has made safe.

## Does the original claim survive

A smaller version does. Every developer should understand enough about how their
software is deployed to make reasonable decisions, and to talk to the people who
run it without a translator. That is a long way from being responsible for the
whole stack, and I should have kept the two apart in 2017.
