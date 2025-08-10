#!/bin/bash

# Test_School Platform Setup Script
echo "🚀 Setting up Test_School Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if MongoDB is running (local)
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB or configure MongoDB Atlas."
    echo "   Local: mongod"
    echo "   Atlas: Update MONGODB_URI in .env.local"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found. Please create it with required environment variables."
    exit 1
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Start the development server
echo "✅ Setup complete! Starting development server..."
echo "🌐 Application will be available at: http://localhost:3000"
echo "📊 API endpoints available at: http://localhost:3000/api"
echo ""
echo "Default Admin Credentials:"
echo "Email: admin@testschool.com"
echo "Password: admin123"
echo ""

npm run dev
