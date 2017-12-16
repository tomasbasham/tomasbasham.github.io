---
layout: post
title: Starting out in CryEngine V
description: My experiences starting out in game development with CryEngine V.
author: Tomas Basham
comments: true
category: Gaming
tags: cryengine development engine game technology
---
It is an irrefutable fact that CryEngine is a fantastic game engine. This is
made evident be the AAA titles that are being released. As a developer I have
been keen to get in on this action and create my own stunning landscapes with a
captivating storyline. However upon being faced with a blank canvas I really do
feel like the David to this game engine Goliath.

This article clearly is not going to be an in depth discussion about how
professionals use this engine and how to implement the next Crysis, however in
this article you will learn the answers I had to some very basic question when
starting out.

## What is CryEngine V?

CryEngine V is the fifth major iteration of the CryEngine game engine developed
by the German company [Crytek](http://www.crytek.com/). Since the release of
the original engine in 2002 it has been used for all their titles and has been
continually updated to support newer technologies, hardware and platforms. This
brings us all the way to CryEngine V, released on 22 March 2016, to support a
new licensing model allowing the engine to be used for free.

The implementation of a launcher, which is used to download the engine, is a
much needed improvement. In the past when stating a game project a new copy of
the engine would need to be downloaded and the game built around the engine
source code. From talking to other game developers who used CryEngine back in
these archaic days they said that they preferred that way of working. Although
Crytek are not the first to do this I personally disagree with the other
developers and am glad Crytek have taken this approach.

### How does it differ from UE4 or other engines?

Before settling with CryEngine V I also ventured into UnrealEngine 4 (UE4) and
Unity. Although all of these game engines offer similar features there were
some key points that made CryEngine V stand out to me:

* 100% Royalty free. Unlike UE4 and Unity which require you to pay royalties
  when you hit the big time, CryEngine is completely royalty free,
* Real time sandbox editing. Both UE4 and Unity have this functionality, but it
  felt more solid in CryEngine,
* Single key press to jump straight into the game. This is facilitated without
  loading the game engine as it is already running within the editor,
* A lot of boilerplate is already done for you. A new project will start with
  an ocean, a small platform, a skybox and Time of Day (TOD) feature with
  daylight/nighttime transition. This was not something I found in UE4,
* An impressive sample level which I feel is more accessible than those on UE4
  or Unity. For instance it runs on my mid spec Windows Desktop whereas the UE4
  Infiltrator demo has no hope in hell of running on my machine.

### What CryEngine is not

So far I have been singing CryEngine praises, but like most things it is not
perfect. In particular:

* It is not as user friendly as other engines, although it is vastly more so
  than in previous versions,
* It currently has little support and scattered documentation,
* I found there to be a partially elitist community (at least those I spoke to
  on Slack), whilst the forums are most helpful,
* It's asset store is lacking in... well, assets. I assume this will improve
  over time. CryEngine (with launcher and store) is very new so the community
  has yet to release many assets.

## The Missing Answers

Now with an introduction to the game engine I present the questions that I had
when starting to use CryEngine V.

### How to Launch the Code, Editor and the Game?

I believe it is important to note that Visual Studio (or MonoDevelop for C#)
should be launched using the `Code_CPP.bat` file (Code_CS.bat for C#) created
after bootstrapping a new game project. This script creates a series of
environment variables that presumably enable Visual Studio to successfully
build the game.

Similarly launching the sandbox editor should be done via the `Editor.bat` file
or from the CryEngine Launcher.

**Update**: Now CryEngine 5.2 has been released the above has been updated.
Instead a working installation of CMake (3.6+) is required to generate a Visual
Studio (or MonoDevelop for C#) project file that can be opened through
explorer, whilst the editor and game are launched through the `.cryproject`
file.

### How are the Config Files Loaded?

There are a couple of configuration files scattered around the engine and
individual projects. These are loaded in a particular order as discussed below:

`system.cfg` is the first config file loaded by the engine and found in the
engine root. I tend not to touch this file and pretend it does not exist.
Unless I know I want a certain configuration for every game I plan to create it
will suffice to put my game configs elsewhere. The exception to this is the
audio middleware. It was recommended that I switch middleware in here.

`editor.cfg` is loaded next and also found in the engine root. Presumably this
config applies only to the editor. As with `system.cfg`, unless I know I want a
certain configuration for every game I wont edit this file.

`game.cfg` is loaded next. This is the configuration file for the specific
project.

**Update**: Prior to version 5.2 `project.cfg` is the loaded last. This file
seemed superflous to me as `game.cfg` would do the job. It would appear it has
been removed.

**Upadte**: Having updated to version 5.3 it appears that `system.cfg` has been
removed so I was unable to continue using this file to host my audio middleware
configurations. Instead I have moved it over to `game.cfg`. This has made a
little more sense to me considering how the new plugin system is supposed to
help separate engine logic from specific game code. Putting my configurations
variables here keeps all my game specific values in one place.

#### Available Configuration Variables

The various configuration variables and console commands are documented on the
CryEngine website and prefixed with the initials of it parent subcomponent of
the engine. For example the `s_` prefix is for the sound engine subcomponent. A
full list of the available configuration variables can be found
[here](http://docs.cryengine.com/display/CRYAUTOGEN/Home).

### What is the Resource Compiler?

The `MakeAssets.bat` invokes the the resource compiler (rc.exe) that optimises
assets for the specific platform. Some useful resources referencing the
resource compiler can be found on the CryEngine website. Ones of note are:
[using the resource
compiler](http://docs.cryengine.com/display/SDKDOC2/Using+the+Resource+Compiler)
and [compiling assets for multiple
platforms](http://docs.cryengine.com/display/CEPROG/Compiling+Assets+for+Multiple+Platforms).

Furthermore `MakeAssets.bat` contains syntax such as `%~dp0`. This is a Windows
shell command that expands the full path to the file (including the drive
letter drive). More on this can be found in
[this](http://stackoverflow.com/a/5034119) StackOverflow answer.

**Update**: In version 5.2 of the engine this feature seems to be broken since
the project.cfg file was removed. I questioned this on the forums to only have
it confirmed. Hopefully this will be fixed ASAP.

**Update**: In version 5.3 `MakeAssets.bat` has been removed from the game
templates. I can only assume it is now handled entirely within the [CMake
system](http://docs.cryengine.com/display/CEPROG/CMake).

### How to implement Wwise sound engine?

When I start a project I like to setup and integrate all the other 3rd party
software I intend to use first. So to begin I wanted to switch the audio
middleware that the engine uses. By default this is SDL Mixer. In order for the
engine to interact with different audio middleware it implements an Audio
Translation Layer (ATL) which is an abstraction interface between CryEngine and
other audio middlewares i.e. Wwise.

I wont be going through the setup of Wwise in this article as it is covered
well
[here](http://docs.cryengine.com/display/CEMANUAL/Setting+up+Wwise+for+CRYENGINE)
but the two important console commands I used are:

    s_DrawAudioDebug 1  <-- Display debug information about ATL middleware.
    s_AudioImplName CryAudioImplWwise  <-- Switch to the Wwise audio middleware. Other options include CryAudioImplFmod (for fmod studio) and CryAudioImplSDLMixer (for sdl mixer).

I also set these in my `system.cfg` file as mentioned earlier. Now every time I
create a new project, or launch a current project the correct audio middleware
is selected.

**Update**: As of version 5.3 I have transitioned this configuration to
`game.cfg` as `system.cfg` has been removed (at least according to my editor
log file which is unable to find it).

## The Unanswered Questions

### How is the C++ Sample Project Structured?

I lean toward using C++ when I can. It seems to have been the industry standard
for many years so there must be something about it that lends itself well to
games. Alternatively it was just the only decent language available at the time
and has just stuck. Regardless, the C++ project the launcher generates includes
a little boilerplate that is not well documented and I simply am unsure what it
all does, whether it is necessary and whether I can remove it without breaking
everything.

I'm cautious that this is an example of [functional
fixedness](https://en.wikipedia.org/wiki/Functional_fixedness), a bias
limitting me to using the engine only in the way it has traditionally been
used. So I intend to figure out what were the intentions of having included
these particular boilerplate features, yet not implement others? Beyond this I
intend to find what each bit does.

### What is Included in the Assets Folder.

The Assets folder contains `Textures.pak`. What is the difference between this
and the `terraintexture.pak` within `Assets/levels/example`? I assume
`Textures.pak` are global textures whereas `terraintexture.pak` contains
textures pertaining to a particular levels lanscape including height maps,
normal maps etc...

## Moving Foreward

I am clearly still no expert here, with some questions still unanswered. I
fully intend to keep this article up to date whilst I discover more answers to
my questions, perhaps adding further questions as they develop.

Please leave comments correcting any of my assumptions as I have likely made
many mistakes in my findings. I would like this to turn into a great starting
out guide to those jumping in at the deep end like myself.
