---
layout: post
title: Developer Rules
description: 3 golden rules for object-oriented development.
author: Tomas Basham
comments: true
image: http://cdn.tomasbasham.co.uk/aladdin-3-wishes.jpg
category: SEO
tags: featured development
---
I have been working on a fairly large Ruby on Rails application for about a year now and have noticed a decline in the readability of the code base as the application has become more complex and exacerbated with small hacks to attempt to solve problems. After all this is supposed to be an agile development team, right? As of late the project team and I have decided to take a small pivot in our business model and whilst the application will still meet the requirements of the project, it has become obvious that there are many features in the application that are no longer required and adding bloat. As such we have decided to start again (as developers do...). However this time we have devised the "Golden Rules" to ensure our application controllers and models are not overcrowded with code that could really be elsewhere.

## The Rules
Here are the rules:

1. Classes can be no longer than one hundred lines of code. This includes tests,
2. Methods can be no longer than five lines of code,
3. Methods can have an arity no larger than 4.

Under no circumstance can these rules be broken, or all hell will break loose.

## The Tools
Fortunately using Ruby we have been blessed with [RuboCop](https://github.com/bbatsov/rubocop), "A Ruby static code analyzer, based on the community Ruby style guide". Just like other linting tools RuboCop allows us to define our "Golden Rules" in a configuration file so it can be committed to version control and shared amongst the team. The configuration we use is as such:

```
ClassLength:
  Max: 100

Documentation:
  Enabled: false

LineLength:
  Max: 120

MethodLength:
  Max: 5

ParameterLists:
  Max: 4

SingleSpaceBeforeFirstArg:
  Enabled: false

AllCops:
  Include:
    - '**/Gemfile'
    - '**/Rakefile'
    - '**/config.ru'
  Exclude:
    - 'db/schema.rb'
    - 'db/migrate/*.rb'
```
