# build
FROM node:14.17.6 AS build
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install --registry=https://registry.npm.taobao.org
COPY . .
RUN npm run build

# run
FROM node:14.17.6-alpine
RUN apk add --no-cache tzdata
ENV TZ="Asia/Shanghai"
RUN mkdir -p /app
WORKDIR /app
COPY --from=build /app/package.json ./
RUN npm install --production --registry=https://registry.npm.taobao.org
COPY --from=build /app/dist ./dist
COPY --from=build /app/bootstrap.js ./
EXPOSE 7001
CMD ["npm", "run", "start"]
