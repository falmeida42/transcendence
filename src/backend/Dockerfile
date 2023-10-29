FROM node:latest

RUN apt-get update && apt-get upgrade -y

RUN node -v

RUN npm install -g n
RUN n latest

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "start"]
