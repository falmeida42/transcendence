#!/bin/bash

# Install app dependencies
npm i
# Generate prisma client, leave out if generating in `postinstall` script
npx prisma generate

npm i cors

npx prisma migrate deploy

exec "$@"