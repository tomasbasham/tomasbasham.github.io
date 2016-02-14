---
layout: post
title: The State of WebRTC Interoperability
description: The status of WebRTC interoperability across browsers.
author: Tomas Basham
comments: true
category: Technology
tags: technology javascript webrtc
---
Firefox Nightly (as of 1/30/13) and Chrome M25 Beta and later are interoperable, but currently require a small degree of adaptation on the part of the calling site.

## API Differences

Firefox and Chrome both prefix their interfaces and are likely to continue to do so until the standard is more finalised. The following table shows the relevant names:

<table border="1" width="100%" style="text-align:center; margin: 10px 0;">
  <tr>
    <th>W3C Standard</th>
    <th>Chrome</th>
    <th>Firefox</th>
  </tr>
  <tr>
    <td>getUserMedia</td>
    <td>webkitGetUserMedia</td>
    <td>mozGetUserMedia</td>
  </tr>
  <tr>
    <td>RTCPeerConnection</td>
    <td>webkitRTCPeerConnection</td>
    <td>mozRTCPeerConnection</td>
  </tr>
  <tr>
    <td>RTCSessionDescription</td>
    <td>RTCSessionDescription</td>
    <td>mozRTCSessionDescription</td>
  </tr>
  <tr>
    <td>RTCIceCandidate</td>
    <td>RTCIceCandidate</td>
    <td>mozRTCIceCandidate</td>
  </tr>
</table>

Firefox and Chrome use different syntax for attaching media streams to video/audio tags.

Chrome uses:

    element.src = webkitURL.createObjectURL(stream);

Firefox uses either:

    element.mozSrcObject = stream;

or:

    element.src = URL.createObjectURL(stream);

Firefox does not implement stream.getAudioTracks() or stream.getVideoTracks().

## Constraint/Configuration Issues

Chrome does not yet do DTLS-SRTP by default whereas Firefox only does DTLS-SRTP. In order to get interoperability, you must supply Chrome with a PC constructor constraint to enable DTLS:

    { 'optional': [{ 'DtlsSrtpKeyAgreement': 'true' }] }

Finally, Firefox offers a data channel on every offer by default (this is a stopgap till the data channel APIs are complete). Chrome mishandles the data channel m-line. In order to suppress the Firefox data channel offer, you need to supply a mandatory media constraint to Firefox on CreateOffer. E.g.,

    { 'mandatory': { 'MozDontOfferDataChannel':true } }

All of these issues are expected to be fixed in the near future.

## SDP Issues

Even in DTLS-SRTP mode, Chrome will not accept offers that do not contain a=crypto lines. In order to call Chrome from Firefox you need to supply a dummy a=crypto line for every m-line.

The code to do this is as follows:

    function ensureCryptoLine(sdp) {
      var sdpLinesIn = sdp.split ( '\r\n' );
      var sdpLinesOut = [];

      // Search for m line.
      for ( var i = 0; i < sdpLinesIn.length; i++ ) {

        sdpLinesOut.push ( sdpLinesIn [ i ] );
        if ( sdpLinesIn [ i ].search ( 'm=' ) !== -1 )
        sdpLinesOut.push ( "a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:BAADBAADBAADBAADBAADBAADBAADBAADBAADBAAD" );

      }

      console.log ( "Exiting ensureCryptoLine." );

      sdp = sdpLinesOut.join ( '\r\n' );
      return sdp;
    }

**IMPORTANT**: Do not add an extra a=crypto line to offers provided by Chrome. This is only necessary on offers from Firefox, not on answers (but it won't hurt to add it). This issue is expected to be fixed in Chrome in the near future.
