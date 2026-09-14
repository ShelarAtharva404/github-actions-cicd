FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY server.js .
COPY db.js .
COPY app.js .

EXPOSE 5000

CMD ["node", "server.js"]
