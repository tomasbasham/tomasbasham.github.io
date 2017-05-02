---
layout: post
title: Setting up Django on OS X
description: Web development with Django within virtual Python installations
author: Tomas Basham
comments: true
category: Development
tags: development osx python
---
Django is a Python web framework that encourages rapid development and clean, pragmatic design. Developed initially for a fast-paced environment where strict deadlines were the 'norm' Django was designed to make common web development task simple, quick and easy.

Similar to web frameworks such as Play! and Ruby on Rails, Django ships with its own simplistic server that is run through Python. This means that developers don't have to mess around with Apache until deployment, and can simply deal with a lightweight server whilst developing their application.

## Environment

I have installed Django on Mac OS X and have done so in a virtual environment. The basic problem being addressed with the virtual environment is one of dependencies and versions, and indirectly permissions. Imagine you have an application that needs version 1 of LibFoo, but another application requires version 2. How can you use both these applications? If you install everything into /usr/lib/python2.7/site-packages (or whatever your platform's standard location is), it's easy to end up in a situation where you unintentionally upgrade an application that shouldn't be upgraded. Using a virtual environment isolates Python environments so that this issue does not occur.

To accomplish this environment I have installed the following software:

* Python 2.7
* Django
* Git
* GCC
* pip
* Virtualenv

## Installing Git

Git is a distributed repository manager used for software configuration management. This is very easy to install, just visit the [git-scm](http://git-scm.com) homepage and follow the download link.

## Installing GCC

I already have Xcode installed on my mac so I did not have to install GCC. Xcode is recommended for installing Python but it is not the only way of installing it. There are alternative download sources to get GCC which are as follows:

* [For OS X 10.7 Lion](https://github.com/kennethreitz/osx-gcc-installer/releases/download/v0.3/GCC-10.7-v0.3.zip)
* [For OS X 10.6 Snow Leopard](https://github.com/kennethreitz/osx-gcc-installer/releases/download/v0.3/GCC-10.6-v0.3.zip)

However I recommend downloading an installing Xcode, which can be easily downloaded from the Mac App Store.

## Installing Python

Python comes preinstalled on OS X and so this was not a necessary step for me. However, it is often the case that Python is outdated on the mac and as such it is best to download the latest version of Python from [here](http://www.python.org/download/). Doing this ensures that Python benefits from all of the bug fixes that have occurred since the version preinstalled on OS X.

## Installing Pip

Pip is a Python package manager and allows for Python packages to be easily installed. Using Python's easy install I downloaded pip through the terminal with the following command:

    $ easy_install pip

## Installing Virtualenv

Next, to download virtualenv I issued the following command in the terminal:

    $ sudo pip install virtualenv

I have found this needs to be run as the root user (`sudo`) otherwise it fails to build and move the files into the appropriate place, because pip tries to access system owned directories.

## Creating a new Virtualenv

To create the isolated environment to install and run Django, I created a new folder for my project and browsed into it:

    $ mkdir new_directory_name
    $ cd new_directory_name

I found later on that creating a directory which contains a space or having the directory reside within a path containing a space causes problems. The later use of pip to install Django into this new environment will not like any spaces in the directory structure and will subsequently break. I then ran the following commands to start a new virtual environment (again, no spaces) and activate the environment:

    $ virtualenv environment_name --no-site-packages
    $ source environment_name/bin/activate

The first command creates a virtual Python environment to work within, whilst the second command runs a bash script called activate which prepends the virtual environment's `bin/` directory to the `$PATH` system variable. This means that all subsequent commands will first be resolved by this directory, causing all Python calls to be executed by the Python executable in this directory. The activate script will also modify the shell prompt to indicate which environment is currently active.

It is worth noting that to deactivate the environment type `deactivate` into the terminal.

## Installing Django

To finally install Django, I simply issued the following command in the terminal:

    $ pip install django

Unlike before issuing this command as the root user will produce adverse effects. Using a standard user will install all the Django files into the new environment that was just created.

## Starting a Django Project

Lastly I just started using Django as normal, issuing this command to create a new project:

    $ django-admin.py startproject project_name
