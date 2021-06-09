#!/bin/bash

export MONGODB_URI="mongodb://localhost:27017/pmgmt"

sudo docker-compose up -d

mocha --timeout 30000 -r ts-node/register 'integration/**/*.ts'