FROM node:8.10.0-alpine
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
ADD . /usr/src/app
RUN npx run-s clean build
CMD ["npm", "start"]
EXPOSE 8081