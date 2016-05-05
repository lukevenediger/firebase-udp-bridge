#!/bin/sh

APPLICATION="$1"
TARGET="$2"

# combine everything
./build.sh ${APPLICATION}

# deploy the latest code
./deploy.sh ${TARGET}
