#!/usr/bin/env bash

SERVERLESS_STAGE=""
if [ "${CIRCLE_TAG}" == "master" ]; then
  export SERVERLESS_STAGE="production"
elif [ "${CIRCLE_TAG}" == "staging" ]; then
  export SERVERLESS_STAGE="staging"
fi
