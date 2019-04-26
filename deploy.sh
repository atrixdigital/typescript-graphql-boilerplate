#!/bin/bash

yarn build
docker build -t osama/my-profile:latest . --no-cache
heroku container:push --app=osama-ahmed-resume-server web
heroku container:release --app=osama-ahmed-resume-server web