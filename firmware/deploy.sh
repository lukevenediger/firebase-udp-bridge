#!/bin/sh

# deploy the latest code
curl --verbose -i -F filedata=@app.js http://192.168.0.13/upload