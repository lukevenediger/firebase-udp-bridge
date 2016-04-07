#!/bin/sh

# deploy the latest code
cp app-gyro.js deploy/app.js
curl --verbose -i -F filedata=@deploy/app.js http://192.168.0.144/upload
