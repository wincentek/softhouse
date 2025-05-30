# Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (no build tools needed for sql.js)
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create directory for SQLite database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]