---
layout: post
title: Reclaim Your Disk Space
description: Reclaiming the disk on you Mac.
author: Tomas Basham
comments: true
category: Technology
tags: technology osx
---
This article focusses on OS X developers that have installed a series of
development tools such as Xcode and Docker and finding they are very quickly
burning through storage space.

### OS X Library folder

On OS X the library folder is used by installed applications to store settings
and other necessary data for the applications to run.

Overtime this folder can get very large and often for reasons unknown to the
user. Below are some of the issue I have had over the last few months.

### Xcode

It turns out Xcode can take up a serious amount of disk space. With new
releases of iOS, OS X and WatchOS, Xcode will periodically install newer SDKs,
documentation and iOS simulators. As these releases move foreward, older
versions are no longer required (unless working on backwards compatible apps)
and can be removed.

The documentation does not tend to be too large in size and I believe these can
be more conveniently removed from within Xcode itself but I found that some of
the docsets I had within my `Library` folder were not listed in Xcode and I had
to delete them manually. Don't ask me why as I have no clue either. For those
pesky docsets, these can be found within the following directory:

{% highlight bash %}
~/Library/Developer/Shared/Documentation/DocSets
{% endhighlight %}

As for the simulators (each about 1GB in size), they can be found within the
following directory:

{% highlight bash %}
~/Library/Application Support/iPhone Simulator
{% endhighlight %}

If you have been using Xcode for many years, you may have noticed that more
recent versions have ditched the snapshot system, presumably because Git is a
far more accepted solution. However migrating to a newer version of Xcode will
not remove these files from the system. This could be seen as a good
**feature**, but for those that simply no longer want nor need these files they
are potentially wasting space.

Deleting snapshots is simple. They appear to all be stored within a
`sparseimage` file and can be deleted together. This file tends not to be large
but it is wasting space nonetheless considering the snapshot feature has been
completely removed. They can be found within the following directory:

{% highlight bash %}
/Library/Application Support/Developer/Shared/SnapshotRepository.sparseimage
{% endhighlight %}

### Docker

Docker is a fairly new technology providing a containerisation platform capable
of packaging up an application or service alongside all of its dependencies
within a complete filesystem. I have been using this for a while and it is a
great tool for both development and production environments. By default docker
logs the the standard output from each container into a file. If your
containers produce a lot of output these logs can grow quite large. This is not
good news, and I have been in a position where I have a log file over 40GB in
size which had accumulated in only 1 week.

The best solution to prevent this in future would be to keep the amount that is
printed to standard output to a minimum within each container. However as an
immediate fix the log file can simply be deleted and Docker will just recreate
it when needed. The log file can be found within the following directory:

{% highlight bash %}
~/Library/Containers/com.docker.docker/Data/com.docker.driver.amd64-linux/
{% endhighlight %}

### Is There an Easier Way?

If trawling through your filesystem for old, unnecessary files is too much
hassle, and lets face it, it is there is a much easier way to discover files
wasting disk space. [DaisyDisk4](https://daisydiskapp.com/) is a disk analyser
tool for OS X that visualizes hard disk usage and allows you to free up hard
disk space. It can be downloaded from the DaisyDisk
[website](https://daisydiskapp.com/).
