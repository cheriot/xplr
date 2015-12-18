#!/bin/bash

# Modified copy of https://gist.github.com/eoinkelly/fd80465942c8ca4bd5c0

# This script can be used in "run & hope" mode or you can use it as a recipe to
# do things manually - you probably want the latter if you really care about
# the data in your databases.
# Happy hacking
# /Eoin/

# Tell bash to stop if something goes wrong
set -e

# Note this has to be set to the exact version you have installed via brew. You
# can get this via:

#   ls -l /usr/local/Cellar/postgresql

# In my case my postgres binaries were in `9.3.5_1`
OLDPG=9.3.5

# set this to your new PG version
NEWPG=9.4.5_2

# Stop current server (if started manually)
# pg_ctl -D /usr/local/var/postgres stop

# Stop current server (if starting from launchctl)
launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist

# Backup current db
mv /usr/local/var/postgres/ /usr/local/var/postgres-$OLDPG

# Homebrew
# Check here if you have issues with either of these https://github.com/Homebrew/homebrew/wiki#troubleshooting
brew update
brew upgrade postgresql
# *** continue from here

# brew upgrade will create /usr/local/var/postgres using for you using `initdb`
# because it does not exist (we moved our existing one to /usr/local/var/postgres-$OLDPG).
# If this fails you could do it manually with:
# initdb /usr/local/var/postgres

# OS X launch agents for PG, so it starts on boot automatically
# TODO
cp /usr/local/Cellar/postgresql/$NEWPG/homebrew.mxcl.postgresql.plist ~/Library/LaunchAgents/

# If pg_upgrade fails you might need to tweak how PG uses kernel resources. You
# can read more at http://www.postgresql.org/docs/9.3/static/kernel-resources.html
# sudo sysctl -w kern.sysv.shmall=65536
# sudo sysctl -w kern.sysv.shmmax=16777216


# The pg_upgrade script will create some other scripts that we can optionally
# run after it completes. They are created in teh CWD so we create a new tmp
# dir to work in and `cd` to it.
mkdir -p /tmp/pgupgrade && cd $_

# Upgrade old DB to new DB
# `man pg_upgrade` for details
# Note: As we are doing here, it is best practice to run this using the
# pg_upgrade binary from the new postgres (as it has knowledge of the new data
# format)
pg_upgrade -d /usr/local/var/postgres-$OLDPG/ \
    -D /usr/local/var/postgres \
    -b /usr/local/Cellar/postgresql/$OLDPG/bin \
    -B /usr/local/Cellar/postgresql/$NEWPG/bin

# Start new Postgres server (if using launchctl)
launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist

# Start new server (if doing manually)
# pg_ctl -D /usr/local/var/postgres start

# Run the optional "analyze" script created by pg_upgrade
# `cat` it for more info - it is quite short
# ./analyze_new_cluster.sh

# Run the optional "delete" script created by pg_upgrade
# `cat` it for more info - it is quite short
# ./delete_old_cluster.sh

# Optional clean-up
# cd ~
# rm -rf /tmp/pgupgrade
