FROM node:latest

WORKDIR /home/node/app

RUN npm i -g @nestjs/cli

COPY script.sh /usr/local/bin/
# COPY package.json .
# COPY package-lock.json .
COPY nest/prisma ./prisma/

RUN npx prisma migrate
RUN npx prisma generate

RUN chmod +x /usr/local/bin/script.sh

ENTRYPOINT [ "script.sh" ]

CMD ["npm", "run", "start:dev"]
