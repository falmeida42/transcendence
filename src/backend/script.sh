#!/bin/bash

# Install app dependencies
npm i

npm i cors

npx prisma migrate dev
npx prisma generate

exec "$@"
