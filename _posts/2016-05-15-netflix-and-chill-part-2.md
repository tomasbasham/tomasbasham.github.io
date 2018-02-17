---
layout: post
title: Netflix and Chill - Part 2
description: Building your own Netflix and chill button tutorial series continuing with the code.
category: Product Design
tags: development netflix technology
---
We finished [last time](/product%20design/2016/05/12/netflix-and-chill.html)
with a complete electronics prototype of our Netflix switch. Next we must
implement the code to make this a working system.

By now we know what hardware we have available to us, but what are we actually
trying to achieve? The goal for the original switch from Netflix was to turn on
the TV and perhaps launch the Netflix app (if you have a compatible TV);
perform a little light show using the LEDs we hooked up previously; and send
messages to another internet enabled device. This other device could be used to
extend the functionality of the switch; making API calls or performing some
home automation.

### Code

I have hosted the code as a 3 part
[gist](https://gist.github.com/tomasbasham/660c84c97bda9d8acb116062c2f56ae2).
The main file is
[Netflix.ino](https://gist.github.com/tomasbasham/660c84c97bda9d8acb116062c2f56ae2#file-netflix-ino)
and orchestrates the hardware we have already hooked up. The other 2 files
implement a simple class that will generate a carrier wave from the Infrared
LED enabling it to be used as a remote control. The specific carrier wave will
be unique to the TV you have and needs to be known before compiling the
application.

### IR Carrier Wave

For the switch to work with your brand of TV you must first know the encoded
signal to turn it on and off. This signal is just a series of pules emitted
from the IR LED that we can represent as an array of timing information (how
long to turn the IR LED on, how long to turn it off, how long to turn it on,
etc...).

There is a great [library](https://github.com/z3t0/Arduino-IRremote) that can
capture this information for us written by Ken Shirriff. Specifically you want
to be looking at [this
file](https://github.com/z3t0/Arduino-IRremote/blob/master/examples/IRrecvDumpV2/IRrecvDumpV2.ino)
but you will need to download and extract the entire library for this to work.

You will need to run this on a separate Arduino hooked up to an IR receiver.
This is fairly simple to do requiring very little setup. More information on
this can be found on
[sparkfun](https://learn.sparkfun.com/tutorials/ir-communication). Once you
have your raw signal, the output should be assigned to the `data` array within
[Netflix.ino](https://gist.github.com/tomasbasham/660c84c97bda9d8acb116062c2f56ae2#file-netflix-ino-L45).

### Messaging Queue

As an optional part of this project I have setup a remote messaging queue on
[Heroku](https://dashboard.heroku.com/apps) that I use to dispatch events when
the switch is activated. This allows any arbitrary code to listen and react to
these events and perform further actions.

The Particle SDK does already provide a cloud based service that can be used to
publish events to any listening subscribers. However this requires the
subscribers to be using the Particle library and tightly couples any
application to the Particle ecosystem.

I prefer to avoid unnecessary coupling where I can and instead recommend
setting up a RabbitMQ instance on Heroku. If you too are planning on
implementing this feature, you'll need to update the username and password
sections of
[Netflix.ino](https://gist.github.com/tomasbasham/660c84c97bda9d8acb116062c2f56ae2#file-netflix-ino-L33-34).

Any subscribers now need to listen on the `home/netflix` topic of the RabbitMQ
server and can perform any action you want. I intend on writing a touchscreen
GUI application for the Raspberry Pi that will order me Dominos Pizzas when I'm
watching a movie. But you can create whatever you want.

### Particle Build

Particle supply an [online IDE](https://build.particle.io) from where you can
compile and upload your sketches to your Particle Photon board. It is pretty
basic, but that is all it needs to be.

Here you can copy across the code into 3 separate files, named exactly as they
are within the gist.

If you followed along with the messaging queue section of this article you will
want to include the MQTT library in your sketch using the libraries tool. If
you do not intend on implementing this particular feature you will want to
comment out anything relating to it otherwise the code will not compile.

When you have verified and uploaded the code to your Photon it should work just
as mine in this video:

<p class="embed-container">
  <iframe width="640" height="390" src="https://www.youtube.com/embed/z3rXOa8zIs0" frameborder="0" allowfullscreen></iframe>
</p>

### Future Work

From my time spent working with the Particle Photon I have noticed a lack of
simplicity when working with the hardware timers available on the board. These
timers would enable me to afford the multithreading support I intended to
generate the Infrared carrier wave. Consequently I have been looking for an
alternative WiFi enabled microprocessor.

### RedBearLab WiFi Mini

The RedBearLab WiFi Mini is the most affordable WiFi capable microprocessor
available at the time of writing that is also compatible with most Arduino
libraries. It is built with the Texas Instruments CC3200 dual core MCU: an ARM
Cortex-M4 core running at 80 MHz with a dedicated ARM core for WiFi network
processing. It also features Over The Air (OTA) download of application
firmware from other WiFi devices or the Internet, enabling similar firmware
upgrades as the Particle Photon.

However the RedBearLab WiFi Mini cannot simply replace the Particle Photon. It
requires its own IDE and some of the lower level features of the board
(hardware timers) require more advanced C programming, which I will need to
work through before I commit to working with this board.

### Timely Library

The [Timely](https://github.com/tomasbasham/Timely) library should go some way
to make this project possible using the RedBearLab WiFi Mini. Timely is an
Arduino compatible library capable of controlling the `TIMER` registers of both
AVR and Texas Instrument microprocessors. This is currently still a work in
progress and I'll update this article when it is stable.

### Conclusion

You should now have a fully functioning system that can turn on your TV,
possibly launching the Netflix app if you have a Netflix recommended TV; put on
a bit of a light show, and optionally dispatch messages to a remote messaging
queue. In the next article we will finish off our switch by housing it within
an enclosure and giving it the wow factor.
