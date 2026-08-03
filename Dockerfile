# Use Node.js 22 LTS
FROM node:22-alpine

# Create working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]