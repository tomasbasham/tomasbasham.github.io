---
layout: post
title: Building a Bar Top Multicade
description: Building my own bar top multicade with the Raspberry Pi.
author: Tomas Basham
comments: true
image: https://cdn.tomasbasham.co.uk/multicade.jpg
category: Product Design
tags: arcade electronics mame raspberry-pi technology
---
For sometime I have wanted an arcade machine for retro gaming, but they can be extremely expensive and take up a lot of space. This is no more true then a full sized cabinet. Furthermore they often come preloaded with only a handful of games that become tiresome pretty quickly. So I set out to solve these problems, saving space and achieving an affordable cabinet capable of playing hundreds of old, classic games.

Of course I am not the first, and I most certainly wont be the last to make my own arcade cabinet, but it must be said the high level of customisation is satisfying and rewarding in the end.

Overall building my own cabinet has taken just over a year, mostly due to finding and waiting on joinery companies to cut out my custom wooden panels as I possess neither the steady hand, patience or machinery to do it myself. If Dr. Leonard McCoy worked in IT I'm sure he'd say something along the lines of "Im a software engineer, not a machinist".

My arcade is a DIY retro bartop arcade cabinet built for two players whom can use either the built in joysticks and buttons or plug in SNES controllers for that added retro console feel. It is powered by a Raspberry Pi Model B capable of playing multiple types of retro games - primarily NES, SNES, Megadrive and arcade (MAME) games.

### Materials List

I believe in total the arcade has cost me around £250, but considering that is a fraction of the cost of some machines it is a real steal. The bill of materials I used to construct the arcade follows:

| Item                                                                                    | Qty. | Merchant        |
|-----------------------------------------------------------------------------------------|------|-----------------|
| [Raspberry Pi Model B](https://shop.pimoroni.com/products/raspberry-pi-3) (or better)   | 1    | Pimoroni        |
| [Heatsink for Raspberry Pi](https://www.amazon.co.uk/gp/product/B00DM2L7Z0/ref=oh_aui_detailpage_o09_s00?ie=UTF8&psc=1) | 1    | Amazon          |
| [32 GB SD Card](https://www.amazon.co.uk/gp/product/B00J29BR3Y/ref=oh_aui_detailpage_o08_s00?ie=UTF8&psc=1) | 1    | Amazon          |
| [3 Pin Inlet](https://www.amazon.co.uk/gp/product/B00F4MGRRE/ref=oh_aui_detailpage_o07_s00?ie=UTF8&psc=1) | 1    | Amazon          |
| [Kettle Lead](https://www.amazon.co.uk/gp/product/B003U798T4/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1) | 1    | Amazon          |
| [4-Way Extension](https://www.amazon.co.uk/Skytroni-Extension-Lead-Surge-Protection-White/dp/B000L9CU6C) | 1    | Amazon          |
| [SNES Controller Extension](https://www.amazon.co.uk/gp/product/B005WMIR4C/ref=oh_aui_detailpage_o01_s00?ie=UTF8&psc=1) | 1    | Amazon          |
| SNES Controller                                                                         | 2    | eBay            |
| 19" 5:4 TFT Monitor                                                                     | 1    | eBay            |
| [Joysticks, Buttons and Controller](https://www.arcadeworlduk.com/products/Arcade-Joysticks-Buttons-And-Arcade-Controller-Kit.html) | 1    | Arcade World UK |
| [Speakers and Amplifier](https://www.arcadeworlduk.com/products/hi-fi-stereo-sound-amplifier-kit-for-arcade-machine-projects.html) | 1    | Arcade World UK |
| [T Moulding (1m)](https://www.arcadeworlduk.com/products/Yellow-3-Quarter-Inch-T-Molding.html) | 5    | Arcade World UK |
| 19mm MDF Panels                                                                         |      | B&Q             |

**Note**: Heatsink is not necessary on newer Raspberry Pi models.
