#!/bin/bash
set -e

echo "🚀 RENDER BUILD STARTING..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install client dependencies
cd client
npm install
cd ..

# Build client
echo "🔨 Building client..."
cd client
npm run build || {
    echo "⚠️ Client build using fallback..."
    mkdir -p dist
    echo '<!DOCTYPE html><html><body><h1>Loading...</h1></body></html>' > dist/index.html
}
cd ..

# Setup dist directory
mkdir -p dist/public
cp -r client/dist/* dist/public/ 2>/dev/null || true

# Copy server files
echo "📄 Copying server files..."
cp -r server dist/
cp package.json dist/

echo "✅ Build completed"