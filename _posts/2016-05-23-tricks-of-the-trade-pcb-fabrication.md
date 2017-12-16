---
layout: post
title: Tricks of the Trade - PCB Fabrication
description: Low cost PCB and stencil printing.
author: Tomas Basham
comments: true
category: Electronics
tags: electronics pcb technology
---
In a [previous article](/product%20design/2016/05/12/netflix-and-chill.html) I
describe prototyping an electronics project using through hole components and
breadboarding. This is an effective method for quickly slapping together a
simple circuit but falls short when you need to scale up or miniaturise your
design.

Typically surface mount reflow is inaccessible to hobbyest, especially when
manufactures expose their contact pads on the bottom of their components making
it impossible to get a soldering iron where it needs to be.

In this article you will learn about the online services offering very
affordable PCB printing and stencilling thus enabling the mere mortal the
ability to put together a working circuit.

## Prerequisites

The only prerequisite required is a PCB design. I find the most common tool to
achieve this to be [Eagle](http://www.cadsoftusa.com/), and although it is a
little daunting at first and not particularly user friendly, it is a great tool
for circuit and PCB design.

The remainder of this article will not be a tutorial on Eagle. There are plenty
of resources available on the web that could likely better introduce the
software. I'm no expert myself.

Personally I used a PCB designed by [Luke
Weston](https://twitter.com/lukeweston), and apart from a few displacements of
vias I made to conform to particular design rules, this is all his work.

## Printing

In order for a PCB to be printed it must be represented in a format that can be
read by a computed-aided machine. For PCB design this is the
[Gerber](https://en.wikipedia.org/wiki/Gerber_format) format. Eagle is capable
of producing this format using its CAM feature.

Many Gerber files may be produced for a single PCB and represent the multiple
layers that make up the board. For example a single PCB could contain the
following: the bottom copper layer; bottom silkscreen layer; drill file layer;
the top paste layer, etc... A list of other Gerber file extension can be found
[here](https://learn.sparkfun.com/tutorials/using-eagle-board-layout/generating-gerbers).

When you have your Gerber files head on over to [OSH
Park](https://oshpark.com/). This is a great site that will print PCBs for a
very reasonable price. I had 3 PCBs printed here for around £10 including
international delivery costs with a total turnaround time of only 2 weeks. If
this is too slow for you they do offer a much quicker turnaround time but at a
much greater cost.

The best feature of the site, in my opinion, is the visual representation of
what they think the board will look like after fabrication, giving you an
account of what you should expect to come through the post.

![PCB Fabrication Board](https://cdn.tomasbasham.co.uk/pcb-fabrication-board.jpg)

The above image is the PCB I ordered. I am very happy with the quality of the
print and will definitely use this service again.

## Stencilling

When applying solder paste by hand it will be far easier for you to use a
stencil rather than using the needle that often comes with the paste syringes.
I learnt that through experience when hand pasting my PCB which had a couple of
integrated circuits with very small pitch sizes. Poor application lead to
bridging and a very unprofessional finish.

Presumably a sister company, [OSH Stencils](https://www.oshstencils.com/#)
produce the perfect accompaniment to a fabricated PCB. Using the same set of
Gerber files you created to print you PCB, OSH Stencils will laser cut a
stencil that can be used to apply solder paste to the PCB contact pads. The
important Gerber file in this process is the one with the `.gtp` extension.
This is the top paste layer defining the positioning and size of the contact
pads on the top half of the board.

The stencil can be made of polyimide film or stainless steel, the former being
the cheapest. I bought the polyimide stencil because I was only creating 3
boards so forking out the extra money on a stainless steel one was less cost
effective.

Applying the paste is easy. I followed this youtube video that describes the
process very clearly:

<div class="embed-container">
  <iframe width="640" height="390" src="https://www.youtube.com/embed/1RMtOAHbfvU" frameborder="0" allowfullscreen></iframe>
</div>

## Placement

Steady hands are required for this step. Using a cheap set of
[tweezers](https://www.amazon.co.uk/gp/product/B00H8KLZG8/ref=oh_aui_detailpage_o03_s00?ie=UTF8&psc=1)
and a pair of [helping
hands](https://www.amazon.co.uk/QUMOX-Helping-Magnifying-Clamps-Soldering/dp/B0116WAUEQ/ref=sr_1_4?s=diy&ie=UTF8&qid=1466626313&sr=1-4&keywords=electronics+magnifying+glass)
I picked up from Amazon, it became fairly straight forward to carefully place
each of the tiny surface mount components onto the solder paste.

The difficulty here is making sure you check the polarity is correct for
components such as diodes and LEDs. In the case of LEDs you may be lucky enough
to have a decent multimeter that will send a small current through the
component when attached to each pole, meaning it will light up when you have it
the correct way.

Another difficulty is ensuring that **all** the contact pads of an integrated
circuit line up with the solder paste on the board. If they are off by just a
little bit it could lead to bridging when the paste is reflowed. Using the
magnifying glass on the helping hands is a great help here (hence the name I
guess).

## Conclusion

Here I have described an extremely manual process to build your own PCB. Of
course this technique is not going to scale well, but if the goal is to create
a small handful of boards then this method is fine.

It is worth noting that I have left this process deliberately unfinished and
have yet to actually reflow the solder paste. I leave this for a future article
where I describe a cheap and easy technique to perform the reflow.
