# Firebase UDP Bridge
The Firebase UDP Bridge -or *FUB* for short- enables low-power internet-connected devices to read, write and subscribe to Firebase nodes over UDP
or WebSocket connections.

## Overview
[Firebase](www.firebase.com) is a backend-as-a-service built for applications that experience unreliable connectivity.



[Firebase](www.firebase.com) makes distributed messaging simple by providing a tree-like structure for storing
and reading datas a rich API for listening for changes. This makes it a great backend for low-powered
internet-connected devices such as the [esp8266](https://en.wikipedia.org/wiki/ESP8266). However, Firebase requires
clients to connect over a web socket or via their [REST api](https://www.firebase.com/docs/rest/api/), which ends up
being difficult and slow on low-powered MCUs. The FUB acts as an intermediatory for such clients and provides a simple
binary packet-based API for doing reads, writes and even subscribing to changes on nodes.

## Overview
[Firebase](www.firebase.com) provides data and messaging services to connected devices that do not have a reliable
network connection. For this reason, Firebase is well-suited for ensuring message delivery and order integrity. The
Firebase UDP Bridge brings these advantages to low-power devices. Using a simple protocol that supports UDP and
WebSocket connections, low-powered internet-enabled devices can interact with Firebase.

### Firebase Feature Support
Using Firebase means that clients can take advantage of everything Firebase has to offer. Some highlights are:

* Reading and writing data in a tree-like structure
* Subscribe to nodes and react to data being added, removed or changed

### Extended Features
In addition to raw Firebase access, the FUB offers clients the following features:

* Oresence
* Session management
* Message channels
* JWT-based Authentication
* Secure communication

## Accessing your data
Using Firebase means that you can interact with your data directly and also have two-way communication with devices
connected via the FUB. A common problem with IoT systems is that it's difficult to integrate management services or
existing applications. Firebase has clients for just about every platform, meaning you can interact with your data
directly, bypassing the FUB.
