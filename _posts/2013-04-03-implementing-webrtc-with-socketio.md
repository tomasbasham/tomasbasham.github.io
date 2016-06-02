---
layout: post
title: Implementing WebRTC with Socket.io
description: How to implement WebRTC and signalling server for P2P videoconferencing.
author: Tomas Basham
comments: true
category: Technology
tags: technology javascript webrtc p2p
---
WebRTC is a free, open source project enabling web browsers the ability of Real-Time Communications (RTC) capabilities via simple Javascript APIs.

WebRTC is currently only available in Google Chrome and Mozilla Firefox (only the nightly builds) but will soon be available in other browsers, if Microsoft and Apple decide to pull their fingers out. The way in which this set of APIs works is first by receiving IP information from a signalling server which details all of the hosts that wish to establish a connection to stream audio and video. The signalling server is up to the developer to implement and is not strictly a WebRTC specific component. When this information has been exchanged it is used to create a P2P connection between the hosts, where streams are exchanged. From here the signalling server has no further interaction and the hosts are free to disconnect from it.

## GetUserMedia

GetUserMedia is the API call to make use of the connected microphone and webcam of a local host. The call to this method can differ between browsers, but I believe that the standard is coming more and more complete at late and in future browser releases we should see this call becoming the same across all browsers.

    getUserMedia ( {video: true, audio: true}, success, fallback ); // success and fallback are callbacks.

The callbacks that are provided to this function deal with the cases when the browser is permitted or denied access to the local microphone and webcam. If successful the **success** callback function should make use of the stream provided to the callback. This could mean placing the stream into a HTML5 video tag. If however the user has denied the browser access then this must be dealt with in the **fallback** callback.

## Signaling Server

For the signalling server I have trialled a few options: WebSockets, Socket.io and Faye. Whilst WebSockets and Socket.io worked very well for establishing connections between hosts they are not able to run natively on rails which is when I turned to Faye which is an rack based extension to rails for implementing an RTC server. It is based on WebSockets (as is Socket.io) and as such should have been easy to work with. However I have yet to get this server working and I may just resort back to using Socket.io which was an abstract framework for working with WebSockets. However this was done is Nodejs, independent from rails. This is not really a problem but is rather annoying.

In order to create a server in Nodejs using Socket.io the following code is used.

    // Create the socket server on the port
    var io = require ( 'socket.io' ).listen ( server.listen ( 1337, function() {
      console.log ( (new Date ()) + " Server is listening on port 1337" );
    }));

Although this has created a way for a host to connect to the server there is not yet a method to listen for connections and act upon messages that are sent to the server. To listen for connections I created a callback to run code when a new host connects:

    // This callback function is called every time a socket
    // tries to connect to the server
    io.sockets.on ( 'connection', function(socket) {
      console.log ( (new Date ()) + ' Connection established.' );
      ...
    });

When a host has connected it is also necessary to know what to do with any messages that arrive at the server. The default is just to broadcast each message to every host that is connected (except the one who sent it originally). This is done with the following:

    // When a user send a SDP message
    // broadcast to all users in the room
    socket.on ( 'message', function(message) {
      console.log ( (new Date ()) + ' Received Message, broadcasting: ' + message );
      socket.broadcast.emit ( 'message', message );
    });

Lastly it is also necessary to know what to do when a user disconnects. In this instance the server will just let all other connected hosts know that a host has disconnecting, although it does not indicate which host it was that disconnected.

    // When the user hangs up
    // broadcast bye signal to all users in the room
    socket.on ( 'disconnect', function() {

      // close user connection
      console.log ( (new Date ()) + " Peer disconnected." );
      socket.broadcast.emit ( 'user disconnected' );
    });

## Client Side Server Connection

From the client side Javascript, in order to establish a connection to the signalling server one must create an TCP/IP object and point it to connect to the server. Lets assume that we are to be using Socket.io and Nodejs as the signalling server frameworks and platforms respectively, you would connect to the server like so:

    // Create a new socket to the server to be
    // used as a signalling channel. This is on
    // port 1337 (because it is badass).
    socket = io.connect ( 'http://localhost:1337/' );

This instantiates a Socket.io object in Javascript that points to a server running on the host team4 on port 1337 (because it is badass). However it is not enough to just create this connection. We need to handle some of the events that occur associated with a connection. The following code demonstrates the use of callback methods to accomplish this.

    socket.on ( 'connect', onSocketConnect ); // Callback when the socket connects.
    socket.on ( 'error', onSocketError ); // Callback when the socket receives and error.
    socket.on ( 'disconnect' ,onSocketDisconnect ); // Callback when the socket disconnects.
    socket.on ( 'message', onMessage ); // Callback when a messaged is received.

Here we can see that each of the callbacks get called when a certain even happens. Probably the most important here is the **message** callback which will be responsible for handling all messages that the server receives.

## RTCPeerConnection

An RTCPeerConnection object is really the heart and soul of WebRTC. It is this which establishes the P2P connection between two hosts in order for them to exchange video and audio stream. After having connected to a signalling server one needs to invoke the following methods to instantiate an RTCPeerConnection object and create an offer to connect:

    connection = new RTCPeerConnection ( {
      iceServers: [{ url:'stun:stun.l.google.com:19302' }],
      ...
    });
    connection.createOffer ( gotDescription, createOfferFailed, mediaConstraints );

By calling create offer, the creates a SDP message which contains the offer to connect. This is sent to the **gotDescription** callback and can then be sent through the signalling server to each connected host. If however this call fails then the **createOfferFailed** callback will be called. The media constrains argument is a JSON formatted object which denotes the constraints on what type of media is being offered and what type should be offered in return. In this case we enforce video and audio.

When a remote host receives the offer, they too create an RTCPeerConnection object and return with an answer. This is achieved as follows:

    connection = new RTCPeerConnection ( {
      iceServers: [{ url:'stun:stun.l.google.com:19302' }],
      ...
    });
    connection.createAnswer ( gotDescription, createAnswerFailed, mediaConstraints );

This creates another SDP message which contains the answer. This is sent to the **gotDescription** callback and can then be sent through the signalling server to the host that sent the offer. This completes the P2P connection and the hosts can now disconnect from the signalling server.

## External Resources

* WebRTC homepage. See [webrtc.org](http://www.webrtc.org/).
* HTML5 Rocks article on real-time communication without plugins (see [Real-time communication without plugins](http://www.html5rocks.com/en/tutorials/webrtc/basics/)).
