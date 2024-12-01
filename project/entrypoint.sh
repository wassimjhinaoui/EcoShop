#!/bin/bash
# Wait for the database to be ready
echo "Waiting for database to be ready..."
max_attempts=30
attempt=0
while ! mysqladmin ping -h"db" -u"root" -p"rootpassword" --silent; do
    attempt=$((attempt+1))
    if [ $attempt -ge $max_attempts ]; then
        echo "Database connection failed after $max_attempts attempts"
        exit 1
    fi
    echo "Waiting for database connection... (Attempt $attempt/$max_attempts)"
    sleep 2
done
echo "Database is ready. Pulling schema..."
# Pull the database schema
npx prisma db pull
# Generate Prisma client based on the pulled schema
npx prisma generate
# Apply any pending migrations (if needed)
npx prisma migrate deploy
echo "Prisma schema pulled and client generated"
# Start the Next.js application
npm run dev