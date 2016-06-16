---
layout: post
title: Building libjingle for the Raspberry Pi
description: A step by step guide to cross-compile the libjingle library for the Raspberry Pi.
author: Tomas Basham
comments: true
category: Technology
tags: technology
---
Following an increasing trend in decentralised applications there is an ever growing demand to produce secure protocols and software development frameworks from which to implement these applications. The modern browser implements an API definition drafted by the World Wide Web Consortium (W3C), called WebRTC, that supports peer-to-peer (P2P) voice/video calling and file sharing without the need to install external plugins.

In this article I will discuss what WebRTC is and its underlying libraries. In addition I will guide you through cross-compiling `libjingle` for the Raspberry Pi to take advantage of P2P technologies without your own applications. Note that this is a largely untested process and does not go through using the library once built.

## What is WebRTC

WebRTC is an API definition containing video and audio codecs and Realtime Transport (RTP) stack. Its primary goal is to provide a layer of abstraction away from the underlying `libjingle` libraries that implement the Extensible Messaging and Presence Protocol (XMPP) stack, Session Traversal Utilities for NAT (STUN) and Interactive Connectivity Establishment (ICE) protocols.

Originally an [open source](https://en.wikipedia.org/wiki/Open-source_software) project released by Google in 2011, following work has been made to standardise the relevant protocols in the IETF and browser APIs in the W3C. These standards aim to allow compatible browsers to establish P2P connectivity across internal and external networks (such as the Internet) and even through firewalls, making it truly distributed at a large scale.

WebRTC is designed as a JavaScript API with 3 major components:

* `getUserMedia`, which allows a web browser to access the camera and microphone
* `RTCPeerConnection`, which sets up audio/video calls
* `RTCDataChannel`, which allow browsers to share data through a P2P connection

### The libjingle library

`libjingle` is a collection of open source C++ code that enable you to build P2P applications. The code handles creating a network connection (through NAT and firewall devices, relay servers, and proxies), negotiating session details (codecs, formats, etc.), and exchanging data.

The code includes network and proxy negotiation classes, XML parsing classes, a STUN server, and all the code required to initiate connections and exchange data between two computers. The connection code enables applications to robustly traverse NAT and firewall devices using the ICE mechanism, to use STUN servers, and to exchange either UDP or TCP data packets. You can use the code as provided, or extend it fit your own specific needs, according to the Berkeley-style license.

`libjingle` was created at about the same time as the [Jingle](https://en.wikipedia.org/wiki/Jingle_(protocol)) Extensible Messaging and Presence Protocol (XMPP) extension. Despite sharing similar names, it is worth noting that `libjingle` implements its own protocol to handle session negotiation; thus, although the `libjingle` protocol and Jingle are very similar, they are not the same, and are not interoperable.

## Cross-compiling libjingle for the Raspberry Pi

From the command line install the necessary toolchain:

```
sudo apt-get install git
sudo git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git /opt/depot_tools
echo "export PATH=/opt/depot_tools:\$PATH" | sudo tee /etc/profile.d/depot_tools.sh
sudo git clone https://github.com/raspberrypi/tools.git /opt/rpi_tools
echo "export PATH=/opt/rpi_tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin:\$PATH" | sudo tee /etc/profile.d/rpi_tools.sh
source /etc/profile
```

```
sudo apt-get install qemu-user-static debootstrap
sudo debootstrap --arch armhf --foreign --include=g++,libasound2-dev,libpulse-dev,libudev-dev,libexpat1-dev,libnss3-dev,libgtk2.0-dev wheezy rootfs
sudo cp /usr/bin/qemu-arm-static rootfs/usr/bin/
sudo chroot rootfs /debootstrap/debootstrap --second-stage

find rootfs/usr/lib/arm-linux-gnueabihf -lname '/*' -printf '%p %l\n' | while read link target
do
  sudo ln -snfv "../../..${target}" "${link}"
done

find rootfs/usr/lib/arm-linux-gnueabihf/pkgconfig -printf "%f\n" | while read target
do
  sudo ln -snfv "../../lib/arm-linux-gnueabihf/pkgconfig/${target}" rootfs/usr/share/pkgconfig/${target}
done
```

```
export GYP_CROSSCOMPILE=1
export GYP_DEFINES="target_arch=arm arm_float_abi=hard clang=0 include_tests=0 sysroot=$(pwd)/rootfs werror="
export GYP_GENERATOR_OUTPUT=arm
```

Makefile

```
SRC=$(PWD)/src

build: fetch sync
	ninja -C $(SRC)/arm/out/Release

fetch: $(SRC)
	fetch --no-history --nohooks webrtc

sync:
	gclient sync --verbose

clean:
	rm -rf $(SRC)/arm

rebuild: clean build
```
