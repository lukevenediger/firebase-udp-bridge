#!/bin/sh

# deploy the latest code
cp app-light-sensor.js deploy/app.js
curl --verbose -i -F filedata=@deploy/app.js http://192.168.0.12/upload
