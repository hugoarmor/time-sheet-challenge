FROM node:18

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN echo 'DATABASE_URL="file:./db/sqlite.db"' >> .env

RUN npx prisma generate
RUN npx prisma migrate deploy

RUN yarn build

EXPOSE 3000

CMD ["npm", "start"]
