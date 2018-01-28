---
layout: post
title: Diagnosing Pods with Kubernetes
description: Using the power of Kubernetes labels and selectors to diagnose problematic pods.
author: Tomas Basham
comments: true
category: Development
tags: development kubernetes
---
Labels are the mechanism in Kubernetes through which system objects may be
given an organisation structure. A label is a key-value pair with well defined
[restrictions](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)
concerning length and value used as an identifier and mapped onto system
objects making them more meaningful within the system as a whole.

Whilst labels (and selectors) underpin how Pods are managed within a Deployment
they can be used in other ways more conducive to the diagnosis of the
containers that make up Pods.

When there is a problematic Pod running within a cluster it may not be
desirable to destroy it without first understanding what went wrong. Instead
the Pod should be removed from the load balancer and inspected whilst no longer
serving traffic.

This can be accomplished through the use of labels and selectors within a
Kubernetes manifest files describing a Deployment. In particular a label such
as `serving: true` may indicate to Kubernetes that a Pod should be placed
within the load balancer and should be serving traffic.

**Note**: The `-L` option in the following command specifies the `serving`
label should be included in the table output by `kubectl`.

{% highlight bash %}
$ kubectl -n myapp get pods -L serving
NAME                     READY     STATUS    RESTARTS   AGE       SERVING
api-441436789-7qzv0      2/2       Running   0          3d        true
api-441436789-dwg2q      2/2       Running   0          3d        true
client-760894609-ggw1b   1/1       Running   0          3d        true
client-760894609-s8blr   1/1       Running   0          3d        true

$ kubectl -n myapp describe service/api
Name:                     api
Namespace:                myapp
Labels:                   <none>
Annotations:              cloud.google.com/load-balancer-type=internal
                          kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"v1","kind":"Service","metadata":{"annotations":{"cloud.google.com/load-balancer-type":"internal"},"name":"api","namespace":"myapp"},"spec..."
Selector:                 app=myapp,serving=true,tier=api
Type:                     LoadBalancer
IP:                       10.7.241.228
LoadBalancer Ingress:     10.132.0.6
Port:                     http2  80/TCP
TargetPort:               %!d(string=esp-port)/TCP
NodePort:                 http2  31364/TCP
Endpoints:                10.4.2.19:9000,10.4.2.21:9000
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
{% endhighlight %}

For instance lets say the Pod named `api-441436789-7qzv0` is returning an
increased number of `404` responses which has been identified as abnormal
behaviour. This Pod is a prime candidate for inspection, but doing so whilst it
is still serving traffic (and thus many `404` errors) is undesirable. Replacing
the Pod with a fresh one may solve the problem temporarily, but finding the
root cause of the issue should be the goal. Therefore to remove this Pod from
the load balancer it's labels must be edited in place.

{% highlight bash %}
$ kubectl -n myapp label pods/api-441436789-7qzv0 --overwrite serving=false
{% endhighlight %}

The Replication Controller backing the Deployment will spin up a new Pod to
replace the one taken from the load balancer whilst the problematic Pod will
remain active for inspection but will not be available to serve traffic.

{% highlight bash %}
$ kubectl -n myapp get pods -L serving
NAME                     READY     STATUS    RESTARTS   AGE       SERVING
api-441436789-7qzv0      2/2       Running   0          3d        false
api-441436789-dwg2q      2/2       Running   0          3d        true
api-441436789-lh8ht      2/2       Running   0          8s        true
client-760894609-ggw1b   1/1       Running   0          3d        true
client-760894609-s8blr   1/1       Running   0          3d        true

$ kubectl -n myapp describe service/api
Name:                     api
Namespace:                myapp
Labels:                   <none>
Annotations:              cloud.google.com/load-balancer-type=internal
                          kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"v3","kind":"Service","metadata":{"annotations":{"cloud.google.com/load-balancer-type":"internal"},"name":"api","namespace":"myapp"},"spec..."
Selector:                 app=myapp,serving=true,tier=api
Type:                     LoadBalancer
IP:                       10.7.241.228
LoadBalancer Ingress:     10.132.0.6
Port:                     http2  80/TCP
TargetPort:               %!d(string=esp-port)/TCP
NodePort:                 http2  31364/TCP
Endpoints:                10.4.2.21:9000,10.4.2.24:9000
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
{% endhighlight %}

**Note**: In the above snippet the endpoints that back the service have changed
to reflect the replacement of the problematic Pod.

Now an interactive terminal session can be made with a container running in the
Pod without affecting traffic.

{% highlight bash %}
kubectl -n myapp exec -it api-441436789-7qzv0 -c api /bin/bash
root@api-441436789-7qzv0:/usr/src/app#
{% endhighlight %}

When the problem has been diagnosed and possibly fixed the Pod can be returned
to the load balancer or more likely just destroyed.
