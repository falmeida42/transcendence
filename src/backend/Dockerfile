FROM node:latest

WORKDIR /home/node/app

RUN npm i -g @nestjs/cli

COPY ./script.sh /

RUN chmod +x /script.sh

ENTRYPOINT [ "/script.sh" ]

CMD ["npm", "run", "start:dev"]
