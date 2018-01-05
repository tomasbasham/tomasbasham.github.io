---
layout: post
title: Writing Efficient Dockerfiles
description: How to write an efficient Dockerfile for development and production environments.
author: Tomas Basham
comments: true
category: Development
tags: development docker
---
In this article, you will learn the importance of structuring Dockerfiles when
containerising an application and the pitfalls of doing otherwise.

After reading this article, you will have a basic idea of what Docker is, how
it can help you, and how it makes application development and deployment more
streamlined.

### What is Docker?

Docker is a containerisation platform capable of packaging up an application or
service alongside all of its dependencies within a complete filesystem. This
filesystem, typically labelled as a Docker image, guarantees that it will
always run the same, regardless of the environment it is running on.

Everything the application needs to run is included: code, runtime, system
libraries and anything else you would install on a server.

### How is this different from Vagrant or any other Virtual Machine?

You may have heard of Vagrant, VirtualBox or any other virtualisation software
that also allow you to isolate services. These tools have been very popular in
the past within the development community but all differ majorly which makes
the development to deployment process far less efficient.

Unlike Docker, each of the above methods requires that you install an entire
guest operating system for each isolated instance. This is great if you require
an operating system that differs from the one on your local machine, or you
require a different operating system for each instance, but considering most
services run on a linux platform these days this is an unlikely scenario.

Docker mitigates this by sharing the guest machine's kernel where isolation is
provided through cgroups and other linux kernel libraries and techniques. This
means that you are not required to install an entire operating system for each
service, potentially saving gigabytes of space.

### But what does this mean to me?

It's all great that I can save space and have linux handle all the dirty work,
but what are the practical sides to using Docker? How does Docker help me write
better software? If you're looking to improve your productivity and not have to
worry about maintaining multiple environments or tooling, you'll appreciate the
following 5 key benefits Docker offers:

### 1. Accelerate Developer Onboarding

Docker prevents the need for new developers having to waste hours setting up
their environments and manually spinning up VM instance to get production code
to run locally. This process can take all day or longer, and new developers can
make mistakes.

With Docker all developers in your team can get your multi-service application
running on their workstation in an automated, repeatable, and efficient way.
You just run a few commands, and minutes later it all works.

### 2. Inspire Polyglotism

Sometimes relying on the language you know best can put a project at a
disadvantage, but to switch to something else requires developers set up the
new technology of choice. Since you can isolate an application in a Docker
container, it becomes possible to broaden your horizons as a developer by
experimenting with new languages and frameworks.

### 3. Infrastructure Agnostic

Docker allows you to encapsulate your application in such a way that you can
easily move it between environments. It will work properly in all environments
and on all machines capable of running Docker.

### 4. Collaboration as a First Principle

The Docker toolset allows developers and sysadmins to work together towards the
common goal of deploying an application. You can track of version history and
image updates across the organisation.

Docker acts as an abstraction. You can share, distribute and manage your
application within [Docker Hub](https://hub.docker.com/), and members of
another team can link to or test against your application without having to
learn or worry about how it works.

### 5. Ship It! Quicker

Without having to spend time setting up a production server, you already have a
working environment contained within your Docker image. Every time an image is
updated it can be very quickly deployed to a production server without any
hassle. This quick turn around provides increased value to end users.

Docker containers can spin up and down in a matter of seconds making it easy to
scale up and down applications when resources are required or no longer needed.

### What is a Dockerfile?

To build a Docker image the Docker daemon needs to know the steps required to
setup the environment under which your application or service will be run. This
is where the Dockerfile comes in. A Dockerfile is a simple series of
instructions that tells the Docker daemon what it must do to build your image.
This includes what base image to use, how to grab and install any dependencies
and finally how to run the container created from the image.

### How they work?

It is important how the Dockerfile is structured because having steps in the
wrong order can make the build process inefficient and time consuming. In order
to understand why this is you need to understand how Docker works.

Think of a Docker image as a git repository. Just like git the Docker image is
built up from a series of "commits". Each commit represents changes that have
happened since the last; such that replaying these commits in the correct order
will reproduce the exact same Docker image.

Every instruction that is performed in the Dockerfile causes Docker to create a
new commit. Therefore a Dockerfile that has 10 instructions will produce a
image that is built up of 10 commits.

If you have ever performed a rebase in git then you'll understand what happens
if you were to alter one of these commits. Every commit that follows the
changed commit will be altered and recomputed (a new hash will be calculated).
Think of this now in terms of Docker. If you build a Docker image containing a
Ruby application then it is likely that part of the Dockerfile requires `bundle
install` to be run to fetch the application dependencies. Now during
development you add another dependency to your Gemfile and rebuild the Docker
image. Since there has been a change to the Gemfile the step in the Dockerfile
that runs `bundle install` needs to be recomputed. Since the hash for this
commit has altered then each subsequent commit needs to be recomputed also.

The problem with the above is that if the Gemfile is changed frequently then
this step, and all that follow it, need to be computed every time the image is
built. If this step is towards the beginning of the Dockerfile then every step
will need to be computed. This is incredibly inefficient but can be remedied by
moving the step further toward the end of the Dockerfile.

### How to write them efficiently

As we have discovered, the order in which instructions are performed in a
Dockerfile can incur significant efficiency penalties if not considered.
Therefore the most efficient way to construct a Dockerfile is to move steps
that change most often towards the end of the Dockerfile. So steps that are the
least likely to change go first and those most likely go last. This is not a
hard and fast rule and should be viewed as a guide.

As an example I have included the Dockerfile I use to build a Ruby on Rails
application:

{% highlight dockerfile %}
FROM ruby:2.4.2-alpine
LABEL com.tomasbasham.maintainer "Tomas Basham <me@tomasbasham.co.uk>" \

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install necessary software packages
RUN apk add --update \
  g++ \
  git \
  libc-dev \
  libxml2-dev \
  libxslt-dev \
  make \
  postgresql \
  postgresql-dev \
  tzdata \
  && rm -rf /var/cache/apk/*

# Add Gemfile and Gemfile.lock separately so docker can cache
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock

# Install things globally, for great justice
RUN bundle config build.nokogiri --use-system-libraries
RUN bundle install

# Add remaining rails project to project directory
ADD . /usr/src/app

ENTRYPOINT ["bundle", "exec"]

CMD ["puma", "-C", "config/puma.rb"]
{% endhighlight %}

### Breaking that Down

{% highlight docker %}
FROM ruby:2.4.2-alpine
LABEL com.tomasbasham.maintainer "Tomas Basham <me@tomasbasham.co.uk>" \
{% endhighlight %}

The first couple of instructions define the base image and the maintainer of
the image. These will never change and therefore go first.

{% highlight docker %}
# Install necessary software packages
RUN apk add --update \
  g++ \
  git \
  libc-dev \
  libxml2-dev \
  libxslt-dev \
  make \
  postgresql \
  postgresql-dev \
  tzdata \
  && rm -rf /var/cache/apk/*
{% endhighlight %}

Following this are some software dependencies gathered by `apk`. These very
rarely change whilst I am developing a Ruby on Rails application.

{% highlight docker %}
# Add Gemfile and Gemfile.lock separately so docker can cache
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock

# Install things globally, for great justice
RUN bundle config build.nokogiri --use-system-libraries
RUN bundle install
{% endhighlight %}

Next the Gemfile is added and `bundle install` is run. This can change from
time to time during development and as such has been placed after those steps
which change less frequently. Now when the Gemfile is changed and the image is
built each step before `bundle install` will be taken from the Docker cache and
not have to be recomputed.

{% highlight docker %}
# Add remaining rails project to project directory
ADD . /usr/src/app
{% endhighlight %}

Last the current working directory (or the project directory) is shared with
the image. The project code changes very frequently during development and has
therefore been put last. Now when the image it built only steps that follow this
a recomputed.

Following this procedure makes our Dockerfiles far more efficient and easier to
reason with.
