FROM node:latest

WORKDIR /home/node/app

RUN npm i -g @nestjs/cli

COPY script.sh /usr/local/bin/
COPY prisma/ ./prisma/

RUN chmod +x /usr/local/bin/script.sh

ENTRYPOINT [ "script.sh" ]

CMD ["npm", "run", "start:dev"]
