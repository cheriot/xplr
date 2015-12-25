#!/bin/bash

set -e
git push;
git push heroku;
heroku run npm run build-client;
