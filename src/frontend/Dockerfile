FROM node:latest

WORKDIR /home/node/app/src

COPY ./script.sh /

RUN chmod +x /script.sh

ENTRYPOINT [ "/script.sh" ]

CMD ["npm", "run", "dev"]
