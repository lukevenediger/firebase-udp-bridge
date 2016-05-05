#!/bin/sh

TARGET="$1"

# deploy the latest code
curl --verbose -i -F filedata=@app.min.js http://${TARGET}/upload
