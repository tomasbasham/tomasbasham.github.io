---
layout: post
title: 5 Things I Hate About Ruby
description: An objective Ruby advocates pet hates about the language.
image: https://cdn.tomasbasham.dev/covers/ruby.svg
category: Development
tags: development ruby
---
I find myself more and more lately banging on about how much better Ruby is
when compared to the other languages used by my colleagues (i.e. PHP). I know,
I know I am truly a Ruby fanboy. I much favour being able to write my
applications in a more "plain English" syntax which offers self documenting and
cleaner code.

However I don't really believe you can trust an advocate who doesn't know
enough to find something wrong with what they are advocating. Given that I use,
love and shout Ruby's praises on almost a daily basis, listing out some of it's
bug bares seems like a good exercise in humility.

### 5. Private is not private

In Ruby there is no such thing as private or protected scope, at least
semantically speaking. The `private` and `protected` keywords only act as hints
to the interpreter not to allow access to methods outside their intended scope.
This leads to a language feature that is not entirely transparent, but equally
as trivial.

It would appear that the language instead guides developers down the "right"
path by making private method invocations more annoying, throwing exceptions,
but does not stop you from doing so. I believe having this relaxed attitude to
method visibility opens the doors to poor code design. Personally I would
prefer to be forced to code in a certain way than have a mechanism to guide my
coding best practices.

To invoke a private method on an object you may simply use the `Object.send`
method.

### 4. Confusing operators?

Ruby has two different, but confusing, set of operators. Those being the widely
used `&&` and `||` which are present in almost every modern computer language,
and the more English style `and` and `or`. To be honest
[this](http://www.virtuouscode.com/2014/08/26/how-to-use-rubys-english-andor-operators-without-going-nuts/)
video by Avdi Grimm does a far better job of explaining the differences than I
can, but it suffices to say that this syntax is copied from Perl whereby the
English style operators have a lesser precedence over the more traditional
style operators.

To be fair both set of operators have different use cases so it is hard to hate
on this feature of Ruby, however it is a very confusing syntax so anybody would
be excused if thinking that they in fact were synonymous.

### 3. Optional perentheses

Ruby does not require that you place parentheses around method arguments.
Although this saves on keystrokes it can be detrimental to readability and in
some cases cause your application to not behave as expected. Take the
following:

{% highlight ruby %}
x = 5

puts (0..10).include? x ? 'yes' : 'no'

# is equivalent to

puts (0..10).include?(x ? 'yes' : 'no')

# is equivalent to

puts (0..10).include?('yes')

# is equivalent to

puts false #=> false
{% endhighlight %}

Clearly this was not the intended result. The Ruby interpreter has taken `x ?
'yes' : 'no'` as a single argument to the `include?` method whereas the
intention was only to take `x`. The correct way to have written this was with
parentheses:

{% highlight ruby %}
x = 5

puts (0..10).include?(x) ? 'yes', 'no'

# is equivalent to

puts true #=> true
{% endhighlight %}

The generally accepted rule is to omit parentheses around parameters for
methods that are part of an internal DSL (e.g. Rake, Rails, RSpec); methods
that are with 'keyword' status in Ruby (e.g. `attr_reader`, `puts`) and those
which take no arguments. Use parentheses for all other method invocations.

### 2. Conventions

There are certain conventions to the Ruby language, but this point concerns
itself around method naming. For example any method ending with a bang (`!`)
indicates that the method will modify the object it's called on. Similarly any
method ending with a question mark indicates that the method will return a
boolean - `true` or `false`. Although this is widely accurate, there are some
instances where this does not hold true. Take for example the
[`Float.infinite?`](https://ruby-doc.org/core-2.2.0/Float.html#method-i-infinite-3F)
method. Instead of returning `true` or `false` it instead returns a trinary
result of either `nil`, `1` or `-1`.

What is the point of having conventions when they can be ignored at any given
time. This now requires developers to remember a series of methods that do not
follow conventions, which defeats the point of having the convention in the
first place.

### 1. Defining private class methods

This touches on the first point in this post where private methods are not
actually private. However this point has driven me crazy in the past so was
worth writing about. There are 2 main ways to define class methods. The first
is using `self.method_name` and the second is as a singleton using `class <<
self`. Both achieve the same result, defining a method on, what is known in the
Ruby community, as the "Eigenclass". This is effectively an anonymous class
that Ruby creates and inserts into the inheritance hierarchy to hold the class
methods.

The problem here is when defining private class methods. You would expect to
write something along the lines of this:

{% highlight ruby %}
class SomeClassWithPrivateMethods
  def self.method_one
    puts 'method one is public'
  end

  private

  def self.method_two
    puts 'method two is public'
  end
end
{% endhighlight %}

This however does not make `method_two` private. The `private` keyword only
affects methods on the class instance, so when we define a class method under
the `private` keyword it does nothing.

Using the singleton approach (`class << self`) we are defining instance methods
on the "Eigenclass", which are just class methods of the containing class.
Confusing, right?

{% highlight ruby %}
class SomeClassWithPrivateMethods
  class << self
    def method_one
      puts 'method one is public'
    end

    private

    def method_two
      puts 'method two is private'
    end
  end
end
{% endhighlight %}

This now works as expected, but adds that extra level of complexity to the Ruby
language that does not really offer any benefits as a developer. I would much
prefer using `self.method_name` if only it was affected by the `private`
keyword.
