FROM node:lts-alpine3.17

WORKDIR /

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4000
CMD ["npm","start"]