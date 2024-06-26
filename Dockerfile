FROM node:20

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 5000

CMD ["npm", "run", "server"]