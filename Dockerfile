FROM node:latest
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 4000
CMD ["npm", "start"]