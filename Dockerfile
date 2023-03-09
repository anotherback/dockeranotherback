FROM node:18.13.0

EXPOSE 80

ENV AOB_V=1.1.5

RUN mkdir /api
RUN npm root -g
RUN npm install npm@9.1.3 -g --force
RUN npm install npx@10.2.2 -g --force
RUN npm install watcher@2.2.0 -g

COPY ./start.js /start.mjs
COPY ./.npm-init.js /root/.npm-init.js

ENTRYPOINT node /start.mjs