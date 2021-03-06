FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install
RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3000 3500
CMD [ "npm", "start" ]