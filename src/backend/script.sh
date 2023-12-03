#!/bin/bash

# Install app dependencies
npm i

npm i cors

npx prisma generate

exec "$@"
