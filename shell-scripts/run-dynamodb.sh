#!/usr/bin/env bash

# I know there's an official docker image by Amazon, but this guy keeps the docker images up to date
# and are more user friendly & Amazon's version
docker run -v "$PWD/.dynamodb":/dynamodb_local_db -p 8000:8000 --name dynamodb -d cnadiminti/dynamodb-local:2019-02-07
