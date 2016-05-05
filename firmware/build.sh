#!/bin/sh

APPLICATION="$1"

# combine everything
cat libs.js mongoose-iot.js witty.js fub.js ${APPLICATION} > app.js
minify app.js
