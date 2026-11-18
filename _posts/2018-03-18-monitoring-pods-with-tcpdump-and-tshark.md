---
layout: post
title: Monitoring Pods with tcpdump and tshark
description: Using tcpdump and tshark to monitor remote pods from your local machine.
category: operations
tags: kubernetes tcpdump tshark diagnostics
---

I remember when I first started to learn about the exciting world of operations,
when it was far easier to execute commands on a remote machine and capture
logging information and packet traces to the remote hosts storage medium to
later be analysed by more sophisticated tools.

However in today's world of containers, kubernetes and distributed systems (or
_distributed complexity_ 😛) there are often limited resources on offer to
facilitate the same level of diagnostic. By and large logs are intercepted from
`stdout` and routed to a dedicated application infrastructure and monitoring
platform such as Google Stackdriver or Amazon CloudWatch.

As for more detailed IP packet traces these would have been written to a `pcap`
file and viewed later in an application like Wireshark. To the best of my
knowledge there are no equivalent cloud services to store this data. Luckily our
options are not exhausted; in such situations I reach for `kubectl exec`,
`tcpdump` and `tshark`.

It is important to note that in order for this to work the kubernetes pod is
required to have `tcpdump` already installed. I would not typically advocate
installing software that is not necessary for the normal operation of a
production application, but in this scenario there is little choice. Furthermore
after capturing packets I would typically delete the pod under test and have
kubernetes spin up a new one, effectively removing `tcpdump` from the container.

So first we need to select a pod whose packets we wish to capture. A good
example would be an API application receiving a good amount of traffic. Grab the
name of the pod using `kubectl get pods`.

```bash
kubectl -n myapp get pods -l tier=api
NAME                   READY     STATUS    RESTARTS   AGE
api-4146221093-7pv1p   2/2       Running   0          200d
```

With a pod chosen we need to install `tcpdump` (if not already installed on the
container). Depending on the package manager available on the container this
could look slightly different. Using `apt` the command would look like this:

```bash
kubectl -n myapp exec api-4146221093-7pv1p -c api apt-get update -qq
kubectl -n myapp exec api-4146221093-7pv1p -c api apt-get install -y tcpdump
```

Now that `tcpdump` has been installed on the pod IP packets can be captured and
routed back to the local host using a combination of `kubectl exec`, `tcpdump`
and `tshark`.

```bash
kubectl -n myapp exec api-4146221093-7pv1p -c api -- tcpdump -s 0 -U -n -w - | sudo tshark --color -i -
Running as user "root" and group "root". This could be dangerous.
tcpdump: listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
Capturing on 'Standard input'
1   0.000000  10.132.0.55 → 10.120.7.52  TCP 74 52903 → 4180 [SYN] Seq=0 Win=65535 Len=0 MSS=1420 SACK_PERM=1 TSval=536911893 TSecr=0 WS=256
2   0.000045  10.120.7.52 → 10.132.0.55  TCP 74 4180 → 52903 [SYN, ACK] Seq=0 Ack=1 Win=28160 Len=0 MSS=1420 SACK_PERM=1 TSval=2627579307 TSecr=536911893 WS=128
3   0.001307  10.132.0.55 → 10.120.7.52  TCP 66 52903 → 4180 [ACK] Seq=1 Ack=1 Win=65536 Len=0 TSval=536911896 TSecr=2627579307
4   0.001409  10.132.0.55 → 10.120.7.52  HTTP 2121 GET /suppliers HTTP/1.1
5   0.001419  10.120.7.52 → 10.132.0.55  TCP 66 4180 → 52903 [ACK] Seq=1 Ack=2056 Win=32384 Len=0 TSval=2627579308 TSecr=536911896
...
```

Here instead of writing the captured packets to a file (typical use case) `-w -`
redirects the `tcpdump` output through `stdout` which is further redirected
through the remote session created by `kubectl exec`. Then on the local host
this data is piped into `tshark`, capturing on `stdin`. Of course tools like
Wireshark can still be used instead of `tshark` if a GUI is preferred; or
alternatively the captured output could be redirected to a file using `tee` as
before.

Regardless of the use case, or how one needs to visualise the data, this
technique is very useful and something I hope to continue using whilst
developing microservice architectures using kubernetes.
