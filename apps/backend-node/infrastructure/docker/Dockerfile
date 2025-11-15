FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port (will be overridden by docker-compose)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]

