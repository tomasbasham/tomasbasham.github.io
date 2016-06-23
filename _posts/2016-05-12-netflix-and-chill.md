---
layout: post
title: Netflix and Chill
description: Building your own Netflix and chill button tutorial series starting with the electronics.
author: Tomas Basham
comments: true
image: https://dl.dropboxusercontent.com/u/59426690/cdn/netflix.jpg
category: Product Design
tags: featured technology netflix electronics
---
Last year the team at Netflix posted a tutorial on how to create your own [Netflix switch](http://makeit.netflix.com/the-switch); automating the arduous task of manually turning on your TV, launching the Netflix app and setting the mood with a movie favourite - pizza. However the step-by-step guide they have written left me more confused that pleased with my new toy.

Beyond confusion the guide at Netflix expects you to have a slightly more than average electronics skill set and access to a variety of devices and tools for cutting out and moulding some of the more custom parts, most notably the enclosure for both the electronics and the device as a whole.

In this series of article you will learn the process I went through to build my own Netflix button and the services I used to acquire 3D printed models. Of course if you have access to your own 3D printer then you wont need this service.

## Electronics

The crux of this project is the electronics. Without this you would be left with a dumb box, so it seems fitting to start here. I will be using through hole components and breadboarding to create this project. These will later be soldered together when assembled into the finished product.

### Materials List

The electronic components for this project are fairly simple, only requiring a handful of LEDs, an LED backlight, some transistors, and a few other common components that can be picked up from [RS Components](http://uk.rs-online.com/web/).

| Item                                                                                    | Qty. | Merchant        |
|-----------------------------------------------------------------------------------------|------|-----------------|
| [White LED Backlight](https://www.adafruit.com/products/1622)                           | 1    | Adafruit        |
| [Momentary Arcade Button](http://www.arcadeworlduk.com/products/Chrome-Ultralux-Illuminated-Arcade-Button.html) | 1    | Arcade World UK |
| [SPDT On/Off Switch](http://www.digikey.com/product-detail/en/EG1201A/EG1902-ND/101723) | 1    | Digikey         |
| [Particle Photon](https://store.particle.io/)                                           | 1    | Particle.io     |
| [Male-to-Male Jumper Cables](https://shop.pimoroni.com/products/jumper-jerky)           | 1    | Pimoroni        |
| [5mm IR LED](http://uk.rs-online.com/web/p/ir-leds/6997635/)                            | 1    | RS Components   |
| [3mm White LED](http://uk.rs-online.com/web/p/visible-leds/8184452/)                    | 1    | RS Components   |
| [3mm Red LED](http://uk.rs-online.com/web/p/visible-leds/7082807/)                      | 4    | RS Components   |
| [10KΩ Resistor](http://uk.rs-online.com/web/p/through-hole-fixed-resistors/0148736/)    | 1    | RS Components   |
| [4.7KΩ Resistor](http://uk.rs-online.com/web/p/through-hole-fixed-resistors/0148663/)   | 2    | RS Components   |
| [560Ω Resistor](http://uk.rs-online.com/web/p/through-hole-fixed-resistors/0148449/)    | 5    | RS Components   |
| [NPN Transistor](http://uk.rs-online.com/web/p/bipolar-transistors/7390385/)            | 2    | RS Components   |
| [Breadboard](https://www.sparkfun.com/products/12002)                                   | 1    | Sparkfun        |
| [LiPo Battery Charger](https://www.sparkfun.com/products/10217)                         | 1    | Sparkfun        |
| [3.7v 1000mAh LiPo Battery](https://www.sparkfun.com/products/339)                      | 1    | Sparkfun        |

**Note**: When prototyping I have opted for a more simple push switch to simulate the larger momentary arcade button.

### Breadboarding

I have drawn a simple schematic piecing the components together. It should be easy to read providing you are on top of your electronic symbols. The most confusing point here is which way around the transistors go. Taking a look at the [datasheet](http://docs-europe.electrocomponents.com/webdocs/13d1/0900766b813d19a8.pdf) for the transistor listed in the materials section we can see the three pins listed as the emitter, base and collector. The emitter is the pin that goes to ground; the base the pin that receives a signal from the Particle Photon; and the collector the pin that draws from the power supply.

![Netflix Switch Schematic](https://dl.dropboxusercontent.com/u/59426690/cdn/netflix-switch-schematic.png)

Everything on this schematic goes to a common ground. This will be the pin marked GND (next to pin D7) on the Photon. LED6 here is the LED Backlight and D1 is the IR LED. If you prefer I have also drawn a breadboard layout detailing precisely where I placed my components and wiring.

![Netflix Switch Layout](https://dl.dropboxusercontent.com/u/59426690/cdn/netflix-switch-layout.png)

You may be able to see that I tend to use a fairly common colour coded convention when wiring. The red cables are power, black are ground and yellow are signal. If you follow this style then you cannot go wrong.

I have also not yet attached the external LiPo battery to the circuit but instead connected an extra jumper cable from the VIN pin on the Photon to the power line on the breadboard. This enables the Photon to share the power from the USB when prototyping. Later we'll use this same pin to power the Photon, LED backlight and IR LED without the use of the USB.

![Netflix Switch Electronics](https://dl.dropboxusercontent.com/u/59426690/cdn/netflix-switch-electronics.jpg)

## Conclusion

At this point you should have a breadboarded prototype of the Netflix Switch. In the next article we will write code for the Particle Photon to turn on the TV, light up the LEDs and optionally send messages to other internet enabled devices.
