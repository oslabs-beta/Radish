FROM node:14-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# FROM node:14-alpine as runtime

# WORKDIR /app
# COPY --from=build /app .

# Add tini for signal handling
RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "server.js"]