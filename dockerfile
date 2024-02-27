# Filename: Dockerfile
FROM node:18-alpine

WORKDIR /index.js
COPY package*.json ./  
RUN npm install
COPY . . 

EXPOSE 5500
CMD ["npm", "run", "dev"]
