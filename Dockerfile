# Dockerfile
FROM node:22.14-alpine

WORKDIR /app

COPY . .

RUN cp example.env .env
RUN npm install
RUN npm run build

COPY entrypoint.sh .
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
CMD ["./entrypoint.sh"]
