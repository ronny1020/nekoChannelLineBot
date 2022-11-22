FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn install

COPY . /app

EXPOSE 80

CMD ["yarn", "start"]
