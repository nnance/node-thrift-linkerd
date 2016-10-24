FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production

# Bundle app source
COPY ./dist/ /usr/src/app/dist/

EXPOSE 3000
CMD ["node","./dist/index.js"]

#WORKDIR /opt/docker
#ADD package.json .
#ADD dist/ dist/
#ADD node_modules node_modules/
#EXPOSE 3000
#CMD npm start
