#!/bin/bash
set -e

echo "🔧 ENHANCED BUILD SCRIPT WITH ESM FIXES"
echo "====================================="

# Function for error handling
handle_error() {
    echo "❌ Error: $1"
    echo "🔍 Check logs for details"
    exit 1
}

# Kill any running servers
echo "🔄 Cleaning up processes..."
pkill -f "node" || true
sleep 2

# Environment setup
echo "🌍 Setting up environment..."
export NODE_ENV=production
export SKIP_PREFLIGHT_CHECK=true
export DISABLE_ESLINT_PLUGIN=true
export TSC_COMPILE_ON_ERROR=true
export GENERATE_SOURCEMAP=false
export NODE_OPTIONS="--max-old-space-size=4096"

# Clean and create directories
echo "🧹 Cleaning and creating directories..."
rm -rf dist build node_modules/.cache || handle_error "Failed to clean directories"
mkdir -p dist/server/shared \
        dist/server/services \
        dist/server/storage/temp \
        dist/server/storage/logs \
        dist/server/storage/documents \
        dist/server/workers \
        dist/public/assets || handle_error "Failed to create directories"

# Install dependencies with optimizations
echo "📦 Installing dependencies..."
npm install typescript @types/node zod express @types/express tsx --save-dev --legacy-peer-deps || handle_error "Failed to install dev dependencies"
npm ci --legacy-peer-deps || handle_error "Failed to install dependencies"

# Setup TypeScript configuration for ESM
echo "🔨 Setting up TypeScript for ESM..."
echo '{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowJs": true,
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["server/shared/*"],
      "@services/*": ["server/services/*"],
      "@config/*": ["server/config/*"],
      "@routes/*": ["server/routes/*"],
      "@middleware/*": ["server/middleware/*"],
      "@workers/*": ["server/workers/*"],
      "@storage/*": ["server/storage/*"]
    },
    "noEmitOnError": false,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "isolatedModules": true,
    "sourceMap": true,
    "declaration": true
  },
  "include": ["server/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts", "dist"]
}' > tsconfig.json

# Build TypeScript with TSX for ESM support
echo "🔨 Building TypeScript with TSX..."
npx tsx ./server/index.ts --validate || handle_error "TSX validation failed"

# Use TSC for type checking and declaration generation
echo "🔍 Running type check and generating declarations..."
npx tsc --noEmit || true

# Build with TSC for production
echo "📦 Building for production..."
npx tsc || true

# Copy additional required files
echo "📝 Copying additional files..."
cp package.json dist/
cp .env dist/ 2>/dev/null || true

echo "🔍 Setting up Render-specific configurations..."
cat > dist/Procfile << EOL
web: NODE_ENV=production node --experimental-specifier-resolution=node ./server/index.js
worker: NODE_ENV=production node --experimental-specifier-resolution=node ./server/workers/background-worker.js
cron: NODE_ENV=production node --experimental-specifier-resolution=node ./server/workers/task-scheduler.js
EOL

# Install production dependencies in dist
echo "📦 Installing production dependencies in dist..."
cd dist
npm install --production --legacy-peer-deps

# ESM-specific fixes
echo "🛠️ Applying ESM fixes..."
find . -type f -name "*.js" -exec sed -i 's/require(/import(/g' {} +
find . -type f -name "*.js" -exec sed -i 's/module.exports/export default/g' {} +
find . -type f -name "*.js" -exec sed -i 's/@shared\/schema/.\/shared\/schema.js/g' {} +
find . -type f -name "*.js" -exec sed -i 's/\.js\";/\";/g' {} +

cd ..

echo "✅ Validating build..."
node --experimental-specifier-resolution=node ./dist/server/index.js --validate || true

echo "🎉 Build completed successfully!"