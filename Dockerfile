# Use a lightweight Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start"]
