FROM node:alpine as builder
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . ./
RUN npm run build

FROM node:alpine as release
WORKDIR /root/
COPY --from=builder /usr/src/app/src src
COPY package.json package.json
ENV NODE_ENV=production
CMD [ "npm", "run", "start" ]
EXPOSE 3000