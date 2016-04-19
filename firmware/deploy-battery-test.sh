#!/bin/sh

# deploy the latest code
cp app-battery-test.js deploy/app.js
curl --verbose -i -F filedata=@deploy/app.js http://192.168.0.157/upload
