FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
RUN npm run build
ENV NODE_ENV=production
ENV APP_ENV_VARS="{}"
CMD [ "npm", "run", "dev" ]
EXPOSE 3000