---
layout: post
title: Swift 3 - Enums
description: Useful application of enums and how to implement them.
author: Tomas Basham
comments: true
category: Development
tags: development iOS swift
---
I am always looking out for better solutions to implement software features
where the language lends itself well to the problem. This way I get the most
out of the language and offload some responsibility to the specific nuances the
language offers. In this article I talk about Swift enums and how I have used
them.

### What is an Enum?

An enum encapsulates a group of related values within a particular domain.
Unlike enums in C which map values to a set of integers, Swift does not enforce
this mapping. If however a value is associated with the related values it is
not limited to integers, but can be represented by any type conforming to
`RawRepresentable` protocol. This means that an associated value can a string,
a character, or a value of any integer or floating-point type.

Swift extends enums further to adopt features traditionally supported only by
classes. This includes the adoption of instance methods, computed properties,
initialisers and the ability to conform to protocols. These features are
particularly useful when needing to implement enums where associated values do
no conform to `RawRepresentable`.

### Using Enum To Implement a Type

Part of an app I am writing required a way to encapsulate the colour scheme I
intend to use. Since there would be a discrete number of colours  an enum
seemed like the best solution. It was also important that I be able to select a
random colour from the enum.

Using an enum the solution was simple as shown in this snippet:

{% highlight swift %}
  enum ColorPalette: UInt32 {
    case blue
    case green
    case orange
    case pink
    case purple
    case red
    case turquoise

    var color: UIColor {
      switch self {
      case .blue: return UIColor(red: 0.39, green: 0.62, blue: 0.71, alpha: 1)
      case .green: return UIColor(red: 0.77, green: 0.87, blue: 0.59, alpha: 1)
      case .orange: return UIColor(red: 0.96, green: 0.76, blue: 0.33, alpha: 1)
      case .pink: return UIColor(red: 0.98, green: 0.82, blue: 0.85, alpha: 1)
      case .purple: return UIColor(red: 0.56, green: 0.47, blue: 0.76, alpha: 1)
      case .red: return UIColor(red: 0.69, green: 0.36, blue: 0.46, alpha: 1)
      case .turquoise: return UIColor(red: 0.35, green: 0.78, blue: 0.72, alpha: 1)
      }
    }

    static func random() -> ColorPalette {
      let randomValue = arc4random_uniform(7)
      return ColorPalate(rawValue: randomValue)!
    }
  }
{% endhighlight %}

Take note of the implementation of `random()`. It instantiates and returns a
`ColourPalette` using a raw value to identify one of it's cases. Each case has
been automatically assigned a numerical default value because the enum has been
declared to store associated values of the `UInt32` type.

**Note**: As stated in the Apple documentation `arc4random_uniform()` is
recommended over constructions like `arc4random() % upper_bound` as it avoids
modulo bias when the upper bound is not a power of two.
