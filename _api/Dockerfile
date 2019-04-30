FROM node:10-alpine as build
WORKDIR /api

COPY package.json /api/
RUN npm install

COPY . /api
RUN npm run build-api


FROM node:10-alpine
WORKDIR /api

ENV TZ=Europe/Tallinn
RUN apk add tzdata && cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && apk del tzdata

COPY package.json /api/
RUN npm install --production

COPY --from=build /api/build /api

CMD node index.js
EXPOSE 5000
