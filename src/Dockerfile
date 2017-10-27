#From the last version of NodeJS
FROM node:latest

#Notre dir pour le Docker -> /app
WORKDIR /app

#On importe les dépendances
COPY package.json /app
RUN npm install
COPY . /app

#On lance le docker
CMD node index.js
EXPOSE 3000