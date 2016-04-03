#!/bin/sh

# deploy the latest code
curl --verbose -i -F filedata=@app.js http://10.4.108.56/upload
