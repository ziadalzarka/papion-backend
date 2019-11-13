FROM node:10
WORKDIR /usr/src/app
COPY . .
RUN npm install
WORKDIR /usr/src/app/libs/uploads
RUN npm install
WORKDIR /usr/src/app/libs/email
RUN npm install
WORKDIR /usr/src/app
EXPOSE 4000
CMD ["npm", "start"]