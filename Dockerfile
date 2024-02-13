FROM node:18

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma migrate deploy
RUN npx prisma generate

RUN yarn build

EXPOSE 3000

CMD ["npm", "start"]
