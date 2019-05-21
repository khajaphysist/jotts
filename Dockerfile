FROM node:alpine as builder
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . ./
RUN npm run build

FROM node:alpine as release
WORKDIR /root/
COPY --from=builder /usr/src/app/src src
COPY --from=builder /usr/src/app/node_modules node_modules
COPY package.json package.json
COPY env-config.json env-config.json
ENV NODE_ENV=production
CMD [ "npm", "run", "dev" ]
EXPOSE 3000