#!/usr/bin/env bash

. ~/repo/.circleci/export-serverless-stage.sh

echo "SERVERLESS_STAGE = ${SERVERLESS_STAGE}"

if [ ! -z "$SERVERLESS_STAGE" ]; then
  echo "Deploying to $SERVERLESS_STAGE"

  # makes an empty node_modules directory if it doesn't exist
  # tools like babel/terser use it as cache (./node_modules/.cache/) if it exists
  mkdir -p node_modules;
  export NODE_OPTIONS="--max-old-space-size=4096";
  SLS_DEBUG=* ../../node_modules/.bin/sls deploy --stage $SERVERLESS_STAGE --verbose
fi
