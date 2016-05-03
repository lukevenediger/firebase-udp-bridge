#!/bin/sh

APPLICATION="$1"
TARGET="$2"

# combine everything
echo cat libs.js mongoose-iot.js fub.js ${APPLICATION} > app.js

# deploy the latest code
echo curl --verbose -i -F filedata=@app.js http://${APPLICATION}/upload
