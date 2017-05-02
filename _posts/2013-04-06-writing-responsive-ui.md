---
layout: post
title: Writing Responsive UI
description: The basics of responsive web UI and how to implement it.
author: Tomas Basham
comments: true
category: Development
tags: css design development html
---
Responsive web design (RWD) is a web design approach aimed at crafting sites to provide an optimal viewing experience-easy reading and navigation with a minimum of resizing, panning, and scrolling-across a wide range of devices (from desktop computer monitors to mobile phones).

A site designed with responsive web design uses CSS3 media queries, an extension of the `@media` rule, to adapt the layout to the viewing environment, along with fluid proportion-based grids and flexible images:

* Media queries allow the page to use different CSS style rules based on characteristics of the device the site is being displayed on, most commonly the width of the browser.
* The fluid grid concept calls for page element sizing to be in relative units like percentages or ems, rather than absolute units like pixels or points.
* Flexible images are also sized in relative units (up to 100%), so as to prevent them from displaying outside their containing element.

We have used Bootstrap as an extension of CSS3 to accomplish responsive web design.

## Viewport

In HTML 5 there exists a meta tag that makes the browser report the size of the screen (or viewport). This allows for CSS to appropriately query it's stylesheet and use the styles associated with the size of the screen. To use this feature of HTML5 place the following in the head of your HTML:

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">

Note the comma separating the **device-width** and **initial-scale** variables. It is often mistakenly replaced with a semi-colon on the internet. I assure you that the comma is the correct usage whilst the semi-colon will throw back HTML warnings.

## Media Queries

Media queries are what makes responsive web design possible. By providing multiple queries with your CSS enables your website to respond to several window sizing constraints. An example of responsive web design via media queries is as follows:

    html, body {
      padding: 20px 0 0 0;
      height: 100%;
    }

    @media (max-width: 979px) {
      body, html {
        padding: 0;
      }

      .content {
        padding: 0;
      }
    }

This code snippet provides a means for the body/html elements and the content class to remove their padding attribute when the width of the browser window is below `979px`.
