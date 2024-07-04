FROM mcr.microsoft.com/devcontainers/typescript-node:0-18

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Set the user
USER node

# Command to keep the container running
CMD ["bash"]