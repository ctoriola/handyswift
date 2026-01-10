#!/bin/bash

echo "🚀 HandySwift Backend Setup"
echo "=============================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please fill in your Supabase credentials:"
    cat .env
    exit 1
fi

echo "✅ .env file found"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The server will run at http://localhost:5000"
echo "Health check: http://localhost:5000/health"
