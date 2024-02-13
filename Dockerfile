FROM node:16 AS sources
ARG NPM_TOKEN
ENV NPM_TOKEN=//registry.npmjs.org/:_authToken=$NPM_TOKEN
RUN npm config set ${NPM_TOKEN}
RUN curl -sfL https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin
WORKDIR /app/
COPY package*.json /app/

RUN npm i --ignore-engines
RUN /usr/local/bin/node-prune

FROM node:16-alpine AS production
ENV PWD=/usr/src/app
RUN apk update && apk add tzdata && cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && echo "Asia/Bangkok" >  /etc/timezone && apk del tzdata
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY --from=sources /app/ /usr/src/app/
COPY . /usr/src/app

CMD ["node","index.js"]