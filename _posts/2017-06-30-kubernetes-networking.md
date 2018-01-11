---
layout: post
title: Kubernetes Networking
description: Looking under the hood of networking in Kubernetes.
author: Tomas Basham
comments: true
category: Development
tags: development docker iptables kubernetes services
---
In the software development scene today, containerisation - and Docker in
particular - is hard to ignore. However when an application needs to scale
horizontally it falls upon container orchestration systems to handle the
complex interconnections between distributed nodes and the containers that they
manage.

It is without doubt that Kubernetes has prevailed as the dominant container
orchestration system, but the networking model that it implements is often
difficult to understand. Before discussing how Kubernetes approaches networking
it is worth understanding how the Docker networking model is implemented to
acknowledge some of the issues.

### The Docker Model

The Docker networking model is somewhat flexible, offering support for multiple
solutions through the use of network drivers. However in the default case
Docker imposes a bridge networking model using a host-private networking
scheme. Docker creates a virtual bridge, called `docker0`, in the root network
namespace and allocates a subnet from one of the private address blocks defined
in [RFC1918](https://tools.ietf.org/html/rfc1918) (typically `172.16.0.0/12`)
to that bridge. For each container managed by Docker a virtual network
namespace is created to isolate the container from the host networking device.
Each namespace is attached to the bridge through a virtual Ethernet device
(`veth`) and mapped to appear as `eth0` from within the container. The virtual
Ethernet device is then allocated an IP address from the address range assigned
to the bridge.

The result of this setup is that each container Docker manages can communicate
with all other containers providing they are connected to the same virtual
bridge. By extension since the bridge is configured behind the node's own Ethernet
device the containers must also be on the same machine. In addition because
Docker is configured to use the same IP address range on every node it follows
that containers across nodes may be assigned the same IP address. This makes
containers unable to communicate with each other across nodes out-of-the-box.

One way for containers across nodes to communicate it to carefully coordinate
the allocation of ports on the node's own IP address and then forward packets
to the respective container. This can be rather errors prone and often lead to
high contention.

Below is a diagram depicting how Docker manages virtual network namespaces for
each container. From this it can be seen how packets would have to traverse
through the virtual bridge to provide connectivity between containers on the
same node.

![Docker Model](https://cdn.tomasbasham.co.uk/docker.png)

### The Kubernetes (IP per Pod) Model

The Kubernetes networking model does not differ much from the Docker model seen
above. However Kubernetes demands a flattening of the IP address space,
dictating that all containers (and their respective nodes) should be able to
communicate with each other without the use of Network Address Translation
(NAT). How this is achieved is of no concern to Kubernetes and may likely be
implemented differently across infrastructure providers. For instance simple L2
ARP lookups across a switching fabric could achieve this, or alternatively L3
IP routing, or an overlay. Providing this demand is respected Kubernetes should
be able to run across a network.

Unlike the Docker model, Kubernetes assigns IP addresses at the Pod level,
where by default a Pod is allocated a private IP address within the network
namespace address range.

Pods themselves provide an isolated, shared network namespace for their content
(containers) meaning containers within a Pod can communicate by making a
request to `localhost`. This consequently means that each container within a
Pod must coordinate port usage. However it is typically considered best
practice to isolate a single container within a single Pod so this issue tends
to be moot. On the occasion there exists one or more containers with a hard
dependency on each other they can be placed within a single Pod but should not
likely need to contest for unallocated ports.

To demonstrate this I have created a single Pod running 2 containers. The
`kubectl` command prints out the Pods details.

**Note** The `-l` options in the following command specifies that only Pods
with a `tier` label set to `api` should be selected for the output.

{% highlight bash %}
$ kubectl -n myapp get pods -l tier=api
NAME                   READY     STATUS    RESTARTS   AGE
api-4146221093-7pv1p   2/2       Running   0          1d

$ kubectl -n myapp describe pod/api-4146221093-7pv1p
Name:           api-1
Namespace:      myapp
Node:           gke-development-cluster-default-pool-9bf27fcd-vqvz/10.132.0.2
Start Time:     Thu, 28 Jun 2017 08:59:10 +0100
Labels:         app=myapp
                pod-template-hash=4146221093
                serving=true
                tier=api
Annotations:    kubernetes.io/created-by={"kind":"SerializedReference","apiVersion":"v1","reference":{"kind":"ReplicaSet","namespace":"myapp","name":"api-4146221093","uid":"f305e98b-f19f-11e7-a706-42010a840036","apiV..."
Status:         Running
IP:             10.4.2.19
Created By:     ReplicaSet/api-4146221093
Controlled By:  ReplicaSet/api-4146221093
Containers:
  ...
{% endhighlight %}

The above Pod can be accessed by making a request to its IP address
(`10.4.2.19`). Since the cluster is running on Google Kubernetes Engine (and by
extension Google Compute Engine) where by default a Pod is given an internal IP
address it can only be accessed from a machine within the same Google Cloud
Platform project.

{% highlight bash %}
$ echo -e "GET / HTTP/1.1\n" | nc 10.4.2.19 9292
HTTP/1.1 200 OK
Content-Type: text/html;charset=utf-8
Content-Length: 0
X-Xss-Protection: 1; mode=block
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Date: Mon, 28 Jun 2017 18:23:32 GMT
Connection: Keep-Alive
{% endhighlight %}

However having applications make requests to this IP address would be futile in
the long run. Since Pods are by nature ephemeral the IP address assigned to
this Pod may not be the same IP address assigned to a Pod in the future.
Instead there needs to be a layer in front of the Pods to maintain a stable
endpoint.

### The Service Abstraction

Services are an abstraction of stability for Pods providing a persistent
endpoint representing a set of containers behind it. This is achieved with a
Virtual Internet Protocol (VIP) address and enables Kubernetes to deal with
changes to the cluster topology dynamically without effecting user perceived
uptime. Clients now only need know the VIP in order to talk to the Pods behind
the Service. This allows for rolling updates where Pods may be completely
replaced, likely allocated different IP addresses, without the client realising
what actions Kubernetes has taken.

The default implementation of the Service abstraction is the `kube-proxy` that
runs on each node in a cluster. Its main responsibility is to query the
Kubernetes API server and configure `iptables` to forward packets to the
correct destination Pods (backends). It is able to configure `iptables` to
perform simple TCP and UDP stream forwarding or round robin TCP and UDP
forwarding across a set of backends. Despite its name `kube-proxy` is **not** a
proxy - once upon a time it was a proxy, now it is a controller. In fact it
does not touch the packets traversing the Kubernetes managed network.

![Kubernetes Model](https://cdn.tomasbasham.co.uk/kubernetes.png)

To demonstrate this I have created a Service that creates a persistent endpoint
for a single Pod. The `kubectl` command prints out the Services details.

{% highlight bash %}
$ kubectl -n myapp get services
NAME      TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
api       ClusterIP   10.7.241.228   <none>        80/TCP   1d

$ kubectl -n myapp describe service/api
Name:              api
Namespace:         myapp
Labels:            <none>
Annotations:       kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"name":"api","namespace":"myapp"},"spec":{"ports":[{"name":"http2","port":80,"protocol..."
Selector:          app=myapp,serving=true,tier=api
Type:              ClusterIP
IP:                10.7.241.228
Port:              http2  80/TCP
TargetPort:        %!d(string=esp-port)/TCP
Endpoints:         10.4.2.19:9000
Session Affinity:  None
Events:            <none>
{% endhighlight %}

Now the same Pod can be reached by making a request to the VIP (`10.7.241.228`)
assigned to the Service.

{% highlight bash %}
$ echo -e "GET / HTTP/1.1\n" | nc 10.7.241.228 80
HTTP/1.1 200 OK
Content-Type: text/html;charset=utf-8
Content-Length: 0
X-Xss-Protection: 1; mode=block
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Date: Mon, 28 Jun 2017 18:23:32 GMT
Connection: Keep-Alive
{% endhighlight %}

By logging onto the node managing the Pod (although any of the nodes would
produce the same output) we are able to see the list of `iptables` rules that
have been created by `kube-proxy`.

{% highlight bash %}
$ sudo iptables-save | grep api
-A KUBE-SEP-JREY6CMQUZ2KMT2G -s 10.4.2.19/32 -m comment --comment "myapp/api:http2" -j KUBE-MARK-MASQ
-A KUBE-SEP-JREY6CMQUZ2KMT2G -p tcp -m comment --comment "myapp/api:http2" -m tcp -j DNAT --to-destination 10.4.2.19:9000
-A KUBE-SERVICES ! -s 10.4.0.0/14 -d 10.7.241.228/32 -p tcp -m comment --comment "myapp/api:http2 cluster IP" -m tcp --dport 80 -j KUBE-MARK-MASQ
-A KUBE-SERVICES -d 10.7.241.228/32 -p tcp -m comment --comment "myapp/api:http2 cluster IP" -m tcp --dport 80 -j KUBE-SVC-CMKF3ZHDEOE3K64F
-A KUBE-SVC-CMKF3ZHDEOE3K64F -m comment --comment "myapp/api:http2" -j KUBE-SEP-JREY6CMQUZ2KMT2G
{% endhighlight %}

When a Pod wants to request this Service any packets are forwarded from the
network bridge, through `iptables` and onto the destination Pod. Specifically
`kube-proxy` has created rules that perform a Destination Network Address
Translation (DNAT) on all packets destined for `10.7.241.228/32` over TCP on
port 80 and rewrites the destination address to the Pod running the container.
In this case `iptables` rewrites the destination address to `10.4.2.19` on port
9000.

It is important to note that `iptables`, in addition to performing a DNAT, also
creates a record in the connection tracking table. This allows `iptables` to
track address translations based on a 5-tuple schema later used to reverse the
translation when a response is received.

### Scaling Up

So far we have only seen what happens with a single Pod. However most
distributed applications require redundancy, adding further complexity. To
demonstrate this I have increased the number of replicas for the Pod from above
to 2. The `kubectl` command prints out the Services details.

{% highlight bash %}
$ kubectl -n myapp describe service/api
Name:              api
Namespace:         myapp
Labels:            <none>
Annotations:       kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"name":"api","namespace":"myapp"},"spec":{"ports":[{"name":"http2","port":80,"protocol..."
Selector:          app=myapp,serving=true,tier=api
Type:              ClusterIP
IP:                10.7.241.228
Port:              http2  80/TCP
TargetPort:        %!d(string=esp-port)/TCP
Endpoints:         10.4.1.14:9000,10.4.2.19:9000
Session Affinity:  None
Events:            <none>
{% endhighlight %}

Once the new Pod has been created the Service has 2 backends where each Pod
may very well be on different nodes. However because of the rules Kubernetes
demands these Pods can both talk to one another. When this new Pod was created
`kube-proxy` created  new rules in the `iptables` across all the nodes in the
cluster. These rules forward packets to the new Pod when the Service is
requested.

{% highlight bash %}
$ sudo iptables-save | grep api
-A KUBE-SEP-A2E6GM52XHOS2X76 -s 10.4.1.14/32 -m comment --comment "myapp/api:http2" -j KUBE-MARK-MASQ
-A KUBE-SEP-A2E6GM52XHOS2X76 -p tcp -m comment --comment "myapp/api:http2" -m tcp -j DNAT --to-destination 10.4.1.14:9000
-A KUBE-SEP-JREY6CMQUZ2KMT2G -s 10.4.2.19/32 -m comment --comment "myapp/api:http2" -j KUBE-MARK-MASQ
-A KUBE-SEP-JREY6CMQUZ2KMT2G -p tcp -m comment --comment "myapp/api:http2" -m tcp -j DNAT --to-destination 10.4.2.19:9000
-A KUBE-SERVICES ! -s 10.4.0.0/14 -d 10.7.241.228/32 -p tcp -m comment --comment "myapp/api:http2 cluster IP" -m tcp --dport 80 -j KUBE-MARK-MASQ
-A KUBE-SERVICES -d 10.7.241.228/32 -p tcp -m comment --comment "myapp/api:http2 cluster IP" -m tcp --dport 80 -j KUBE-SVC-CMKF3ZHDEOE3K64F
-A KUBE-SVC-CMKF3ZHDEOE3K64F -m comment --comment "myapp/api:http2" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-A2E6GM52XHOS2X76
-A KUBE-SVC-CMKF3ZHDEOE3K64F -m comment --comment "myapp/api:http2" -j KUBE-SEP-JREY6CMQUZ2KMT2G
{% endhighlight %}

Now Kubernetes must make a choice as to which backend to forward packets.
`iptables` will pick one of the backends at random, based on some statistic
condition. In this case each Pod has a 50% chance of being selected. From here
the process is as before; `iptables` will perform a DNAT, add a record to the
connection tracking table, and forward packets to the destination Pod.

The root network namespace now acts as a distributed load balancer. This is
true because the same set of rules are configured on each of the nodes in a
cluster, so a Service can be "discovered" in the same way from every Pod,
regardless of the node that it runs on.

### External Resources

* [Kubernetes](https://kubernetes.io/)
* [Linux Namespace](https://en.wikipedia.org/wiki/Linux_namespaces)
* [Network Address
  Translation](https://en.wikipedia.org/wiki/Network_address_translation)
* [Address Resolution
  Protocol](https://en.wikipedia.org/wiki/Address_Resolution_Protocol)
* [iptables](https://en.wikipedia.org/wiki/Iptables)
