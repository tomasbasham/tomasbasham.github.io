---
layout: post
title: Swift 3 - Pattern Matching
description: Has Britain leaving the EU delayed energy efficiency initiatives within the UK?
author: Tomas Basham
comments: true
category: Development
tags: development swift iOS
---
Whilst working on an iOS app, I was able to really jump into some Swift 3 features that were very new to me. Swift 3 has so many advantages over Objective-C but the one I am most impressed with is pattern matching.

Having dabbled a bit with Erlang and other functional programming languages in the past I can immediately see the benefits of this functional paradigm within Swift. It is rather advantageous because Swift now allows us to solve problems perhaps beter suited to functional programming languages (at least where pattern matching is concerned), and we may take examples from these other language to adapt them to work with Swift. So without further ado, lets talk about pattern matching.

## The Model

Say you are modelling your favourite burger. Here's [mine](http://glutenfreeregina.com/wp-content/uploads/2016/08/Five-Guys.jpg). Each topping could be represented as a separate case within an `enum`.

    enum BurgerTopping {
      case Bun(type: String, seeds: Bool)
      case Patty(type: String)
      case Cheese(type: String)
      case Pickle
      case Tomato
    }

You get the idea. Add whatever toppings take your fancy.

## The Humble Switch

In essence we have been using very basic pattern matching for a long time in languages such as Objective-C, C, Java, and many others through the form of switch statements. Here we tend to match strings with other strings or integers with other integers. But now we can take the humble switch statement and put it on steroids.

Using pattern matching switch statements can be used to match more complex structures containing placeholder variables, and bind these variables to real values if they match:

    func add(_ topping: BurgerTopping) {
      switch topping {
      case let .Bun(type, _):
        print("\(type) bun with or without seeds. The mystery is killing me")
      case let .Patty(type):
        print("Juicy. Delicious. Succulant \(type) patty")
      case let .Cheese(type):
        print("You genius! \(type) Cheese. Sounds great!")
      case .Pickle:
        print("Pickles? Ok, if you're sure")
      case .Tomato:
        print("Gotta love those tomatoes")
      default: break
      }
    }

When the `BurgerTopping` instance matches one of the cases, lets take the second case as an example, then a new variable `type` is created and the associated value is bound to this variable.

Notice also the use of the wildcard pattern `_` in the first case, which indicates the presence of a variable but we don't really care what it is. In the above code I have used it in place of the seeds value. This is because I don't intend on using it in the proceeding statement.

Also note the fourth and fifth cases where no variables have been bound. `Pickle` and `Tomato` have no associated values so we don't need to add the `let` keyword. Furthermore if we were to write `case let .Bun(_, _)` this would be equivalent to `case .Bun` as we dont need to bind any values.

## Where and Fixed Values

As you can see there are a few way in which pattern matching can be made useful for this use case. The `BurgerTopping`s could be made a lot more complex or you could be modelling something entirely different (i.e. a signup form where each cell in a tableview could be represented).

But we can go further. Where I had included a wildcard in place of the `seeds` value I now want to have a separate case for when seeds is either `true` or `false`. We can do this with the `where` clause. This is added to the end of a case as shown below:

    func add(_topping: BurgerTopping) {
      switch topping {
      case let .Bun(type, seeds) where seeds == true:
        print("\(type) bun with seeds. Yeeha!")
      case let .Bun(type, seeds) where seeds == false:
        print("Ooooo. A lovely \(type) bun. Good choice!")
      ...
      }
    }

Here the first case will match with a `Bun` where it's seeds value is equal to `true`, whereas the seconds case will match with a `Bun` where it's seeds value is equal to `false`.

Of course this is a very trivial equality whereby the value can only ever be `true` or `false` and can alternatively be written with Fixed Values i.e. `case let .Bun(type, true):`. This does the exact same thing as the first case above except instead of using `where` I have explicitly attempted to mach a constant value.

## If and Guard Case

The switch statement is not the only to benefit from pattern matching. It may also be used with `if case` and `guard case`. Below is a reimplementation of the switch statment we have been using:

    func add(_ topping: BurgerTopping) {
      if case let .Bun(type, seeds), seeds == true {
        print("\(type) bun with seeds. Yeeha!")
      }

      if case let .Bun(type, seeds), seeds == false {
        print("Ooooo. A lovely \(type) bun. Good choice!")
      }

      if case let .Patty(type) = topping {
        print("Juicy. Delicious. Succulant \(type) patty")
      }

      if case let .Cheese(type) = topping {
        print("You genius! \(type) Cheese. Sounds great!")
      }

      if case let .Pickle = topping {
        print("Pickles? Ok, if you're sure")
      }

      if case .Tomato = topping {
        print("Gotta love those tomatoes")
      }
    }

You may notice this is more verbose than the switch case scenario, due mostly to curly braces and newlines, but yields the exact same results. Writing `if case let x = y { ... }` is strictly equivalent to writing `switch y { case let x: ... }:`; it’s just a more compact syntax useful when you only want to pattern match against one case as opposed to a switch which is more adapted to multiple case matching.

Take note that the `where` clause here is represented by a single comma, creating a multi-clause conditional statement.

## What Else?

Beyond the control flow constructs mentioned above, pattern matching can also be used with `for case` and types. I have not yet needed to use these features and may write about them in a future post. Until then I am going to continue to altering my development habits to accomodate this functional pattern.

## External Resources

* Patterns. See [developer.apple.com](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Patterns.html).
* Match Me if you can: Swift Pattern Matching in Detail. See [appventure.me](https://appventure.me/2015/08/20/swift-pattern-matching-in-detail/).
