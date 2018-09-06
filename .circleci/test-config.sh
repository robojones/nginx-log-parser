#!/usr/bin/env bash
COMMIT_HASH=$(git rev-parse --verify HEAD)

curl --user ${CIRCLECI_TEST_TOKEN}: \
    --request POST \
    --form revision=${COMMIT_HASH}\
    --form config=config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/robojones/token-server/tree/master
