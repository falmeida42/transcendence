#!/bin/bash

# Install app dependencies
npm i
# Generate prisma client, leave out if generating in `postinstall` script
npx prisma generate

exec "$@"