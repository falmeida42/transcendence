FROM node:latest

RUN apt-get update && apt-get upgrade -y

RUN node -v

RUN npm install -g n

RUN n latest

RUN node -v

RUN npm i -g @nestjs/cli

RUN mkdir backend

COPY . .

WORKDIR /backend

CMD ["npm", "run", "start"]