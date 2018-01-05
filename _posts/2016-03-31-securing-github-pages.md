---
layout: post
title: Securing GitHub Pages
description: Adding SSL to your GitHub pages.
author: Tomas Basham
comments: true
category: Development
tags: development security web
---
Towards the end of 2015 [Google
announced](http://thenextweb.com/google/2015/12/17/unsecured-websites-are-about-to-get-hammered-in-googles-search-ranking/)
that it will start favouring those sites encrypted by SSL. In light of this I
have secured my personal website and a few of the sites I have created for a
handful of projects.

In this article, you will learn how to secure your own GitHub pages using the
[Kloudsec](https://kloudsec.com/) platform and acquire your own SSL certificate
for free.

After reading this article, you should be familiar with what SSL is and how you
can utilise it to boost your ranking on Google and more importantly secure your
sites.

### Update

Since writing this article Kloudsec has been shutdown. However CloudFlare offer
an alternative solution called [Universal
SSL](https://blog.cloudflare.com/introducing-universal-ssl/). This provides
that same level of security that Kloudsec offered whilst remaining free to use.
In my honest opinion CloudFlare also has a more streamlined interface including
a few more features that Kloudsec lacked, namely HTTP Strict Transport Security
(HSTS) support.

### What is SSL

SSL is the umbrella term for both the Transport Layer Security (TLS) protocol
and it's predecessor Secure Socker Layer (SSL). Both are cryptographic
protocols that provide security over computer networks (i.e. the Internet).
They achieve this by preventing unauthorised persons from accessing networks in
an intelligible form, while still delivering content to the intended parties.
Most major websites presently use TSL to ensure a secure communication between
their servers and their visitor's web browsers.

The more current incarnation of SSL, TLS, has the primary goal to provide
privacy and data integrity between two communicating parties.

### Whats Does This Mean for Me?

Google claim that "user security has always been a top
priority"[1](#cite-note-1). This, we can assume, is why they are strongly
promoting sites that adhere to best security standards.

Above this, the Internet and the web have become an ubiquitous entity in modern
society. As such it should not suffer from eavesdropping, man-in-the-middle
attacks, or any other data security threats.

If you wish to increase the security of your own websites and receive a nice
boost from Google, you'll appreciate that when a site is secured by TLS, the
connection between a web server and a visitor's web browser has the following 3
properties:

### 1. Privacy

The connection is private because symmetric cryptography is used to encrypt the
data transmitted. The keys for this symmetric encryption are generated uniquely
for each connection and are based on a shared secret negotiated at the start of
the session. The server and client negotiate the details of which encryption
algorithm and cryptographic keys to use before the first byte of data is
transmitted. The negotiation of a shared secret is both secure (the negotiated
secret is unavailable to eavesdroppers and cannot be obtained, even by an
attacker who places himself in the middle of the connection) and reliable (no
attacker can modify the communications during the negotiation without being
detected).

### 2. Authentication

The identity of the communicating parties can be authenticated using public-key
cryptography. This authentication can be made optional, but is generally
required for at least one of the parties (typically the server).

### 3. Reliability

The connection is reliable because each message transmitted includes a message
integrity check using a message authentication code to prevent undetected loss
or alteration of the data during transmission.

### What is Kloudsec

Kloudsec is an online platform geared toward finding performance issues on your
websites and attempts to fix them automatically. It is free of charge for the
most basic of uses and offers both a CDN and SSL certificate without any
complicated setup.

Specifically Kloudsec will improve page speeds by up to 40% through asset
optimisation and compression, meaning all your images, javascript files and
styling are stored on their CDN and optimised for super-fast page loads.

More importantly Kloudsec automatically adds an SSL certificate to your
website, giving you the little green padlock in the address bar indicating a
secure connection. Typically this level of SSL security is know as Domain
Validation (DV) and does not require any form of vetting for the Certificate
Authority (CA) beyond checking the right of the applicant to use a specific
domain name.

The SSL certificate is what we intend to focus on here, although Kloudsec does
offer some other great features such as page speed analytics and flagging pages
causing errors.

### How to Secure my Website?

In order to claim the benefits of a secure connection between your website and
a visitors web browser you must first
[signup](https://kloudsec.com/dashboard/websites/new) to Kloudsec. They first
ask that you put in your domain name. This is the domain you have registered
through a Domain Registar such as namecheap. Type in the domain name without
the `www` or any other subdomain you have setup. You are able to separately add
SSL certificates on a subdomain level later.

Next you just need to create a few DNS records through you domain registrar.
The Kloudsec site does guide you through the exact records to make, along with
the information you must provide to your registrar. I personally use
[namecheap](https://www.namecheap.com) because the service is amazing, so I
will assume you are using the same for the remainder of this article.

Click through to your namecheap dashboard and select 'manage' on the domain you
wish to configure DNS records for and then through to 'Advanced DNS'. Here is
where you should provide the registrar with the details listed on Kloudsec.
Take a minute or two to do that and confirm you have copied the information
across correctly, otherwise you'll be ripping your hair out when it does not
work and you don't know why.

It can take up to 24 hours for your DNS records to propagate through, although
I find that most of the time it only takes an hour and sometimes less. Move
back over to your Kloudsec dashboard and click through to 'Protection'. Enable
'1-Click Encryption'. This is going to issue you with an SSL certificate from
[Let's Encrypt](https://letsencrypt.org/).

And that is it. It may take some time for the DNS records to settle and for
your certificate to be generated and be applied to your site, but be patient.

### Secure Subdomains

It is just as easy to secure any subdomains you have setup. Go to your Kloudsec
dashboard and click through to 'Settings'. You should see a list of subdomains.
Click 'Add More' to have Kloudsec issue you with an other certificate for you
subdomain. You will now have to create another `A` record within your domain
registrar pointing to the same IP address as the others.

Again it may take time for the DNS records to settle and for your certificate
to be generated and be applied to your site, but be patient.

### External Resources

* <a name="cite-note-1"></a>[Indexing HTTPS Pages by
  Default](https://webmasters.googleblog.com/2015/12/indexing-https-pages-by-default.html)
