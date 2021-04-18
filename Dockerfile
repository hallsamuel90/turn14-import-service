FROM node:12.16.1-alpine
WORKDIR /usr/src/app
COPY package.json .
RUN yarn install
ADD . /usr/src/app
RUN yarn build
CMD ["yarn", "start"]
EXPOSE 8081