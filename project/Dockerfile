FROM node:18

WORKDIR /app

# Install MariaDB client
RUN apt-get update && apt-get install -y mariadb-client

# Install dependencies
COPY package*.json ./
RUN npm install

# Install Prisma globally
RUN npm install -g prisma

# Copy the entire project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create an entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

# Use the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]