---
layout: post
title: Protocol Buffers and Optional Fields
description: Using well-known types to differentiate missing vs default values with protobuf.
category: Development
tags: development grpc protobuf
---
Protocol Buffers are a serialisation solution developed by Google providing a
platform and language neutral mechanism to send and receive structured data
across the wire. Protocol Buffers encode data into dense binary objects that
reduce packet sizes, enabling faster data exchange but with the disadvantage
that the binary objects are not easily human readable.

Protocol Buffers allow developers to define how they want their application
data to be structured and the Remote Procedural Calls (RPC) to be made
available for a particular service. An example of a Protocol Buffer
(specifically `proto3`) definition follows with a "Greeter" service that takes
a user's name and returns a customised greeting.

{% highlight protobuf %}
syntax = "proto3";

package greeter;

service Greeter {
  rpc Greet(GreetRequest) returns (GreetResponse);
}

message GreetRequest {
  string name = 1;
}

message GreetResponse {
  string message = 1;
}
{% endhighlight %}

Very often we rely on inconsistent code at the boundaries of our applications
where rarely we enforce strict typing and structure of the data we exchange.
Being able to encapsulate the business semantics of an application within a
simple definition strengthens those boundaries providing a means to enforce
business logic. This functions well when all data is required to be present in
each message, however in less trivial applications business logic demands for
the ability to define values that may be nullable; something not possible with
`proto3` using primitive data types. In contrast previous versions of Protocol
Buffers, namely `proto2`, allowed for optional fields providing nullable
support for any field type.

To understand why, it may help to think about for what reasons `proto2` and
`proto3` both omit fields from the encoded data. In `proto3` fields always have
a value and as such are never left unset. Because of this `proto3` can achieve
a smaller payload by not transferring fields set to their default values. This
incurs a form of compression, saving a few bytes on message exchange.

The `proto2` specification, in addition to the above, keeps track of whether
the current value was explicitly set on a field. It is this feature of `proto2`
that allows for the optional field types. If the current value was not
explicitly set then the value is not transferred. This of course carries a
small penalty of needing extra storage space to transfer flags indicating
fields that have been explicitly set.

In light of this `proto3` has been designed to distinguish between the absence
of a primitive typed field and its default value through the use of the
[official value wrapper
types](https://github.com/google/protobuf/blob/master/src/google/protobuf/wrappers.proto)
that form part of the `proto3` "standard library".

{% highlight protobuf %}
syntax = "proto3";

package greeter;

import "google/protobuf/wrappers.proto";

service Greeter {
  rpc Greet(GreetRequest) returns (GreetResponse);
}

message GreetRequest {
  google.protobuf.StringValue name = 1;
}

message GreetResponse {
  string message = 1;
}
{% endhighlight %}

The main difference here is the addition of the `StringValue` submessage that
is a simple wrapper around a `string` field.

{% highlight protobuf %}
message StringValue {
  string value = 1;
}
{% endhighlight %}

In `proto3`, submessages can be set to `nil` allowing developers to use
wrappers for fields where the value may be optional. This adds a small amount
of overhead since wrapper values end up consuming an extra byte per field
because of the additional message layer. In addition the presence of the field
must be checked before it is used.

Despite this, one still cannot guarantee that the value in the wrapper was
explicitly set or defaulted to its zero value. However this moves the problem
of supporting optional values further away from the `proto3` specification and
more toward developer conventions. Typically if a submessage is `nil` then an
application consuming the message can assume the field was deliberately (or
perhaps accidentally) omitted. If however the submessage has a non-nil value
then it must be assumed that whatever value is held by the wrapper was intended
to be consumed.
