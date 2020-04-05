FROM node:12.16.1-alpine
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
ADD . /usr/src/app
RUN npm run build
CMD ["npm", "start"]
EXPOSE 8081