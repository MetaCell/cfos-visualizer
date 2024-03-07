## Context of the build should be the repository root

# Use an official Node runtime as the base image
FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container (in a separate step for caching purposes)
COPY client/package*.json ./

# Install the application's dependencies inside the container
RUN npm install  --legacy-peer-deps

# Copy the content of the /client directory to the container
COPY client/ ./

# Build the React app for production
RUN npm run build

# Install the 'serve' package to serve the static files
RUN npm install -g serve

# Command to run the application
CMD ["serve", "-s", "build"]
