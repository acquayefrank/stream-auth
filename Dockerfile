# https://hub.docker.com/_/node/ 
# I chose alpine because it's the smallest image and perhaps good enough for this use case
FROM node:19-alpine3.16

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
