---
layout: post
title: Installing Java 6 on Ubuntu
description: How to install Java 6 on Ubuntu for legacy applications.
author: Tomas Basham
comments: true
category: Development
tags: development java ubuntu
---
As of August 2011 Java no longer comes part of the default installation. This is due to Oracle retiring the distributor license that allows operating system vendors from providing Java as a package along with their products. This means that Canonical have removed the Java JDK package from it's partner repositories, thus making it unavailable for installation through this means. The only alternative it seems is to use OpenJDK, but often stability wins over features, and as such I needed a way to install the official Oracle Java JDK opposed to OpenJDK.

The process of install the Oracle Java JDK is quite simple; you only have to download the JDK and JRE from the Oracle website, install them as normal and then inform Ubuntu about the newly installed Java version.

## Downloading Java

When Java is released it is posted on the main [download page](http://www.oracle.com/technetwork/java/javase/downloads/index.html). If however there is a need to download an older release of Java, perhaps for building Android from source, then these can be found on the [previous releases page](http://www.oracle.com/technetwork/java/archive-139210.html).

When you have found the release of Java that you want then download both the JDK and JRE that are compatible with your system; either Linux x86 or Linux x64.

## Installing Java

Typically Java would have been installed within a directory owned by the system. Therefore it only makes sense to do the same thing. Through the terminal create a new directory that Java will be installed in.

    $ sudo mkdir -p /usr/lib/jvm

The `p` flag makes sure that each level of the directory hierarchy is present and if not creates it too. Then move the JDK and JRE that have been downloaded in to this directory and then move to this location.

    $ sudo mv "path to jdk" /usr/lib/jvm
    $ sudo mv "path to jre" /usr/lib/jvm
    $ cd /usr/lib/jvm

Unix will not let any file be executed unless it has permission to do so. Therefore to change the permissions of the two installer the `chmod` command needs to be run with the new permission as arguments.

    $ sudo chmod u+x jdk-6u45-linux-x64.bin
    $ sudo chmod u+x jre-6u45-linux-x64.bin

Extract each of the installers which will essentially install the software, putting relevant files in place.

	$ sudo ./jdk-6u45-linux-x64.bin
	$ sudo ./jre-6u45-linux-x64.bin

## Informing Ubuntu about Java

Ubuntu needs to know about the new installation of Java in order for it to be used. `update-alternatives` is the command to do this. This command maintains symbolic links determining default commands. As such this will maintain links to the `java` and `javac` commands which were previously installed. Using `update-alternatives` allows for multiple installations of a system or software package to exist and allows for these to be flipped between pretty easily by setting which alternative system to use.

    $ sudo update-alternatives --install "/usr/bin/java" "java" "/usr/lib/jvm/jre1.6.0_45/bin/java" 1
    $ sudo update-alternatives --install "/usr/bin/javac" "javac" "/usr/lib/jvm/jdk1.6.0_45/bin/javac" 1

To tell Ubuntu which Java installation is the default is pretty easy. Since there is currently only one installation on the system then just tell Ubuntu to use that one.

    $ sudo update-alternatives --set java /usr/lib/jvm/jre1.6.0_45/bin/java
    $ sudo update-alternatives --set javac /usr/lib/jvm/jdk1.6.0_45/bin/javac

## Update the System Path

Now to actually find Java when it is typed into the terminal or invoked through another application the system wide path needs to be altered to include the directory in which Java is installed. Open up `/etc/profile` with a text editor (I prefer to use `nano`) and add to the bottom the following:

    JAVA_HOME=/usr/lib/jvm/jdk1.6.0_32
    PATH=$PATH:$HOME/bin:$JAVA_HOME/bin
    export JAVA_HOME
    export PATH

Save and close the text editor. A reboot is required to accommodate for these changes. After the reboot Java should be available for use. To check for this try find the versions of the Java application.

    $ java -version
    $ javac -version

These should return the version numbers of the Java packages that were downloaded and installed. If the numbers differ then something went wrong.
