# nodejs
FROM node:latest
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "./bin/www & node ./config/consumer.js & ./config/cron.js" ]

# rabbitmq
FROM rabbitmq:latest