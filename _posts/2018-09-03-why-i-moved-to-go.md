---
layout: post
title: Why I Moved to Go
description: Ruby was the language I liked best until a Kubernetes project made Go the better fit, and the reasons turned out to be practical ones.
category: development
tags: go kubernetes grpc containers
---

Last year I wrote a list of [five things I hate about
Ruby]({% post_url 2017-03-06-5-things-i-hate-about-ruby %}) and introduced
myself as a fanboy. It was a fond list. Optional parentheses and the two sets of
boolean operators are the complaints of someone who intends to keep using the
language, and none of them is the reason I now write Go.

The reason is less interesting than a grievance. When I joined a new team in
2017, they were learning Go as part of the project in hand. The team was mostly
a Ruby shop, so this was a deliberate move, and I arrived in the middle of it
rather than choosing it. What I can say now is that the choice has held up,
and that the reasons it held up are specific enough to be worth writing down.

## The ecosystem is written in Go

The project was going to run on Kubernetes, and Kubernetes is written in Go, as
is Docker and most of the tooling that sits around them. The
[networking posts]({% post_url 2017-06-30-kubernetes-networking %}) I wrote in
2017 were an exercise in reading how a Go system behaves from the outside.
Being able to read the source when the documentation runs out is a different
kind of access, and a language the platform shares with your service makes that
access cheap. Terraform, which arrived in my work at about the same time, is
the same story: providers are Go programs.

## The compiler answers questions earlier

Ruby tells you about a mistake when the line runs. Go tells you when you build.
The difference is easiest to see with a small example, a function that
promises a number and is handed something else.

```go
package main

import "fmt"

func total(prices []float64) float64 {
	sum := 0.0
	for _, p := range prices {
		sum += p
	}
	return sum
}

func main() {
	fmt.Println(total([]string{"1.50", "2.25"}))
}
```

```
./main.go:14:20: cannot use []string{…} (value of type []string) as []float64 value in argument to total
```

The equivalent Ruby would run until it tried to add a string to a float, which
in a service means a request that fails in production rather than a build that
fails on a laptop. I have come to think of the compiler as an oracle that
answers a narrow class of question instantly and without argument, and I would
rather consult it than discover the same answer from a user. Across the project
so far, only a small handful of bugs have been found, and that is the outcome I
would credit most to this.

## One static binary

We were deploying to Kubernetes, which makes the shape of the artefact matter.
A Go program compiles to a single static binary with no interpreter, no gems
and no runtime to install, so the image around it can be almost empty.

```dockerfile
FROM golang:1.11 AS build
WORKDIR /go/src/app
COPY . .
RUN CGO_ENABLED=0 go build -o /app .

FROM scratch
COPY --from=build /app /app
ENTRYPOINT ["/app"]
```

The final image contains the binary and nothing else. It is small to pull,
quick to schedule, and has very little in it that could be vulnerable, which
makes it a good match for a platform that starts and stops containers all day.

## Concurrency and gRPC

The service was going to be many small services talking to each other, which I
wrote about in [building a cloud native
service]({% post_url 2018-07-12-building-a-cloud-native-service %}). Go's
goroutines and channels make handling many concurrent requests an ordinary
thing to do rather than a library to adopt, and gRPC and Protocol Buffers are
well supported in the language, with generated clients and servers that are
checked by that same compiler. The contract between two services stops being a
document and becomes something the build can verify.

## What it costs

Go is not free. Error handling is verbose, and without generics there are
places where you write the same loop again for a different type. Those are
real costs and I notice them daily. They are also costs that show up while
writing the code, which is a better place to pay them than in production.

I moved to Go because the platform, the compiler and the artefact all pointed
the same way, not because I fell out of love with anything. Ruby is still the
language I would reach for to write a script, and I still think its syntax
reads more like English than anything else I use.
