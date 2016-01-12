# Firebase UDP Bridge (or FUB for short)
Enables low-power, internet-connected devices to read, write and subscribe to Firebase nodes using UDP.

## Overview
[Firebase](www.firebase.com) makes distributed messaging simple by providing a tree-like structure for storing
and reading data as well as a rich API for listening for changes. This makes it a great backend for low-powered
internet-connected devices such as the [esp8266](https://en.wikipedia.org/wiki/ESP8266). However, Firebase requires
clients to connect over a web socket or via their [REST api](https://www.firebase.com/docs/rest/api/), which ends up
being difficult and slow on low-powered MCUs. The FUB acts as an intermediatory for such clients and provides a simple
binary packet-based API for doing reads, writes and even subscribing to changes on nodes.
