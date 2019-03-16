#!/usr/bin/env bash

SERVERLESS_STAGE=""
if [ "${CIRCLE_BRANCH}" == "master" ]; then
  export SERVERLESS_STAGE="production"
elif [ "${CIRCLE_TAG}" == "staging" ]; then
  export SERVERLESS_STAGE="staging"
fi
