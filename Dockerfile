FROM node:24.11.1-alpine3.23
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ ./
EXPOSE ${PORT}
CMD sh -c "npm install && npm run start:dev"