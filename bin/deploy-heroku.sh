#!/bin/bash

set -e
git push;
git push heroku;
heroku run npm run knex migrate:latest
