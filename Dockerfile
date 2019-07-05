FROM node:10-alpine

ENV NODE_ENV development
ENV PORT 80
WORKDIR /code

ADD package.json package-lock.json /code/

RUN npm install

ADD . /code

RUN npm run config && npm run migrate

USER node
EXPOSE 80
CMD npm start
