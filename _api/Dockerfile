FROM node:20-alpine as build
WORKDIR /api

COPY package.json package-lock.json /api/
RUN npm ci

COPY . /api
RUN npm test
RUN npm run build-api


FROM node:20-alpine
WORKDIR /api

ENV TZ=Europe/Tallinn
RUN apk add tzdata

COPY package.json package-lock.json /api/
RUN npm install --production

COPY --from=build /api/build /api

CMD node index.js
EXPOSE 5000

HEALTHCHECK --start-period=5s --interval=5m --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/bookings || exit 1
