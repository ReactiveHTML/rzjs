#!/bin/bash

aws s3 sync --acl public-read --exclude="*" --include="*.tgz" ./ s3://static.cubelets.digital/
