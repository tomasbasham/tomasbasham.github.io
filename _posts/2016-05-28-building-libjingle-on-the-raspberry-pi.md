---
layout: post
title: Building libjingle for the Raspberry Pi
description: A step by step guide to cross-compile the libjingle library for the Raspberry Pi.
author: Tomas Basham
comments: true
category: Development
tags: development p2p webrtc
---
Following an increasing trend in decentralised applications there is an ever growing demand to produce secure protocols and software development frameworks from which to implement these applications. The modern browser implements an API definition drafted by the World Wide Web Consortium (W3C), called WebRTC, that supports peer-to-peer (P2P) voice/video calling and file sharing without the need to install external plugins.

In this article I will discuss what WebRTC is and its underlying libraries. In addition I will guide you through cross-compiling `libjingle` for the Raspberry Pi to take advantage of P2P technologies within your own applications. Note that this is a largely untested process and does not go through using the library once built.

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

First we requires a suitable Linux cross-compilation host. I will tend to use another linux host, preferably Debian based, since Raspbian is Debian based also. Due to this they share a similar command line and should have compatible build tools. Regardless you will need to install the necessary toolchain.

I have created a Dockerfile containing all of the configuration you are about to read through. It is still a work in progress and uses Alpine Linux as its base image to try reduce the final image size. You can find it on [GitHub](https://github.com/tomasbasham/webrtc-armhf) in its current incarnation. Any pull requests are welcome to help complete this project.

### Installing the toolchain

First we need to install depot_tools and add it to the shell `PATH`. depot_tools is a collection of code checkout management packages maintained by Google that includes `gclient`, `gcl`, `git-cl`, `repo` and others. We will use these tools to checkout and build the webrtc codebase.

```
sudo apt-get install git
sudo git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git /opt/depot_tools
echo "export PATH=/opt/depot_tools:\$PATH" | sudo tee /etc/profile.d/depot_tools.sh
```

The second part of the toolchain is a series of common linux packages already compiled for the raspberry pi ARM architecture. These will be used to cross-compile the webrtc codebase for the raspberry pi.

```
sudo git clone https://github.com/raspberrypi/tools.git /opt/rpi_tools
echo "export PATH=/opt/rpi_tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin:\$PATH" | sudo tee /etc/profile.d/rpi_tools.sh
```

Last we need to define a series of build flags.

```
echo "export GYP_CROSSCOMPILE=1" | sudo tee /etc/profile.d/meta_build.sh
echo "export GYP_DEFINES=\"target_arch=arm arm_float_abi=hard clang=0 include_tests=0 sysroot=$(pwd)/rootfs werror=\"" | sudo tee -a /etc/profile.d/meta_build.sh
echo "export GYP_GENERATOR_OUTPUT=arm" | sudo tee -a /etc/profile.d/meta_build.sh
```

Remember that despite adding these statements into the `profile.d` folder they will not take effect until you start a new shell session. To do this either logout and back in or simply type `source /etc/profile` to "refresh" your current session.

### Bootstrapping a compatible filesystem

Next we are going to install a Debian base filesystem into a subdirectory of the current folder compatible with the ARM Hard Float Port architecture. We will do so using the debootstrap package. This is known as "cross-debootstrapping".

This needs to be done in two parts because we'll be bootstrapping a foreign base system with a differing architectures from the host. The initial step downloads the necessary `.deb` files and unpacks them only. A copy of debootstrap sufficient for completing the bootstrap process will be installed as /debootstrap/debootstrap in the target filesystem. This is then run with the `--second-stage` option to complete the bootstrapping process.

The second part runs all of the package configuration scripts, which must be done using the target architecture (or by using qemu-user-static to emulate the target architecture). Here we opt for the latter by copying `qemu-arm-static` into the bootstrapped filesystem just before running the second stage.

```
sudo apt-get install qemu-user-static debootstrap
sudo debootstrap --arch armhf --foreign --include=g++,libasound2-dev,libpulse-dev,libudev-dev,libexpat1-dev,libnss3-dev,libgtk2.0-dev wheezy rootfs
sudo cp /usr/bin/qemu-arm-static rootfs/usr/bin/
sudo chroot rootfs /debootstrap/debootstrap --second-stage

find rootfs/usr/lib/arm-linux-gnueabihf -lname '/*' -printf '%p %l\n' | while read link target; do
  sudo ln -snfv "../../..${target}" "${link}"
done

find rootfs/usr/lib/arm-linux-gnueabihf/pkgconfig -printf "%f\n" | while read target; do
  sudo ln -snfv "../../lib/arm-linux-gnueabihf/pkgconfig/${target}" rootfs/usr/share/pkgconfig/${target}
done
```

When this has finished you will have successfully built an environment capable of cross-compiling webrtc for the raspberry pi.

### Building the library

Finally we can your the tools downloaded earlier to build the webrtc codebase. First create a working directory chage directory into it. You can call this working directory whatever you want and is used primarily to encapsulate what we're trying to achieve. From here building the libjingle library is simply a series of 3 commands that will checkout the code; synchronise it with the external repository (if necessary); and then finally build from source.

```
fetch --no-history --nohooks webrtc
gclient sync --verbose
ninja -C $(PWD)/src/arm/out/Release
```

This can take a rather long time and the `gclient` command is prone to error from time to time. If this does happen then running it again should fix the problem. You may need to run it several more time until it finally completes.

## External Resources

* WebRTC homepage. See [webrtc.org](http://www.webrtc.org/).
* WebRTC development documentation (see [development](https://webrtc.org/native-code/development/)).
