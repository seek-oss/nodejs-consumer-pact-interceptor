#!/bin/bash -e

cd $(dirname $0)
PATH=$PATH:../../node_modules/.bin

# Run tests
mocha pact-consumer-test.js

echo Tests pass, now publishing PACT:
# curl -X PUT -d post-pact.json http://pact/  ....
