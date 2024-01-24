FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn install

COPY . /app

RUN ${RENDER_GIT_COMMIT} > /app/version.txt

CMD ["yarn", "start"]
