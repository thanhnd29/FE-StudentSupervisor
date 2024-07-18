# Use an official Node.js runtime as a parent image
FROM node:21.7.3-alpine3.18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# install yarn
RUN npm install -g npm@10.6.0

# Install app dependencies
RUN yarn install

# Copy the rest of your application code to the working directory
COPY . .

# Expose a port to communicate with the React app
EXPOSE 3000

# Start your React app
CMD ["yarn", "run", "dev"]