FROM node:10-alpine as build
WORKDIR /api

COPY package.json /api/
RUN npm install

COPY . /api
RUN npm run build-api


FROM node:10-alpine
WORKDIR /api

COPY package.json /api/
RUN npm install --production

COPY --from=build /api/build /api

CMD node index.js
EXPOSE 5000
