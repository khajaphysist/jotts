FROM node:alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . ./
RUN npm run build
ENV NODE_ENV=production
CMD [ "npm", "run", "dev" ]
EXPOSE 3000