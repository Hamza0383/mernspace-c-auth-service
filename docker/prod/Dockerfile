FROM node:22-alpine as builder
WORKDIR /server
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine as production

ENV NODE_ENV=production

WORKDIR /server

COPY package*.json ./

RUN npm ci --ignore-scripts
# --omit=dev

COPY --from=builder /server/dist ./

EXPOSE 5500

CMD ["node", "src/server.js"]