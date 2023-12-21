FROM node:21.4.0 as build

WORKDIR /app

COPY package.json /app/package.json

COPY . /app

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
