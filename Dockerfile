# Use Node.js 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Install Firebase CLI globally
RUN npm install -g firebase-tools

# Expose port (for local testing)
EXPOSE 5173

# Start command
CMD ["npm", "run", "preview"]
