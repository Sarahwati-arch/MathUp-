# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app (optional if using a static build)
RUN npm run build

# Expose port the app runs on (e.g., 3000 for React)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
