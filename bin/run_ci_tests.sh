#!/bin/bash
export MONGODB_URI="mongodb://localhost:27017/productSyncJobData"

sudo docker-compose up -d

nyc mocha -r ts-node/register "./{tests,integration}/**/*.ts"

sudo docker-compose down