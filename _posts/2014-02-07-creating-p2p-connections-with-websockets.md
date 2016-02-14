---
layout: post
title: Creating P2P Connections with WebSockets
description: Creating persistent connections between web peers using sockets.
author: Tomas Basham
comments: true
category: Technology
tags: technology javascript p2p
---
WebSockets are a technology that creates a persistent connection between a web browser and a web server allowing two way communication
between the two to occur at any time. The types of application this technology is best suited are that of real time software
applications offering instant updates and that possibly share data between multiple parties. For example WebSockets are used to
create such applications as multiplayer online games; chat and videoconferecing; update feeds; collaboration tools and any other
application where the sever may be expected to send data to the client at any given time.

## Opening a WebSocket

The WebSocket API is presented as a JavaScript method taking a URL endpoint to connect to. You may notice in the code snippet below
the `ws:` URL schema. This identifies that this URL uses the WebSockets protocol. There is also `wss:` for making secure WebSocket
connections. This is similar to how `https:` is used to make secure `http:` connections.

    // Create a new WebSocket.
    var connection = new WebSocket ( "ws://localhost/chat" );

## Handling Events

Now that a persistent connection has been made with the server, we need to listen for certain events on the connection. The connection
object shares with us four properties that can have functions assigned to them. These act as callback when certain events occur.

    connection.onopen = function() {
      console.log ( "WebSocket open" );
    }

    connection.onmessage = function(event) {
      console.log ( "Message: " + event.data );
    }

    connection.onerror = function(error) {
      console.log ( "Error: " + error );
    }

    connection.onclose = function() {
      console.log ( "WebSocket closed" );
    }

Within these callbacks you may perform whatever function deemed necessary for the application being written. Here I have simply output
the connection state, along with any messages that have been received from the server. It is likely that you will wait until the `onopen`
callback is fired before any data is passed to the server.

The server may send to us messages at any time. Whenever this happens the `onmessage` callback fires. The callback receives an event
object where the actual message is accessible via the data property.

## Sending Messages to the Server

With the connection and callbacks setup we can send messages and other binary data to the server. All types of data are send via the
send method, a property of the connection object. The easiest type of data to send is a string which can be passed to the send message
as is.

    connection.send ( "message" );

However binary data can also be send to the server using either a blob or an array buffer. These objects are passed into the send method
just as a string is.

## Server Side

On the server side a technology capable of sustaining large amounts of concurrent connections open at the same time is required. A
preferable technology would be Node.js; capable of running applications architected for high concurrency at a low performance cost. Node.js
differs from other runtimes and servers such as it is designed around a non-blocking IO pattern as opposed to more tradition servers
such as apache which block until an IO operation is complete.
