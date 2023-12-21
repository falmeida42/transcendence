#!/bin/bash

# Install app dependencies
npm i

npm i cors

npx prisma migrate deploy
npx prisma generate

exec "$@"
