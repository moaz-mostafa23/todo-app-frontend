#!/bin/bash

echo "📦 Building Todo App frontend for production..."
# Navigate to frontend directory (in case script is called from elsewhere)
cd "$(dirname "$0")"

# Install dependencies if node_modules doesn't exist or --force flag is passed
if [ ! -d "node_modules" ] || [ "$1" == "--force" ]; then
  echo "📥 Installing dependencies..."
  npm install
fi

# Get the CloudFront URL if it's not set
if [ -z "$REACT_APP_CLOUDFRONT_URL" ]; then
  CLOUDFRONT_URL=$(aws cloudformation list-exports --query "Exports[?Name=='TodoAppCloudFrontURL'].Value" --output text)
  if [ ! -z "$CLOUDFRONT_URL" ]; then
    export REACT_APP_CLOUDFRONT_URL="$CLOUDFRONT_URL"
    echo "📡 Using CloudFront URL: $REACT_APP_CLOUDFRONT_URL"
  fi
fi

# Build the React app
echo "🔨 Building React application..."
npm run build

echo "✅ Frontend build completed successfully!"