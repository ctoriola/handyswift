#!/bin/bash

# Production Build Verification Script
# Checks that the project is ready for production deployment

echo "🔍 HandySwift Production Readiness Check"
echo "========================================"
echo ""

FAILED=0

# Check Node.js version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "  Version: $NODE_VERSION"

# Check npm version
echo "✓ Checking npm version..."
NPM_VERSION=$(npm -v)
echo "  Version: $NPM_VERSION"

# Check if .env files exist
echo "✓ Checking environment files..."
if [ -f ".env.production" ]; then
  echo "  ✓ .env.production exists"
else
  echo "  ✗ .env.production missing"
  FAILED=$((FAILED + 1))
fi

if [ -f ".env.development" ]; then
  echo "  ✓ .env.development exists"
else
  echo "  ✗ .env.development missing"
  FAILED=$((FAILED + 1))
fi

# Check if vercel.json exists
echo "✓ Checking Vercel configuration..."
if [ -f "vercel.json" ]; then
  echo "  ✓ vercel.json exists"
else
  echo "  ✗ vercel.json missing"
  FAILED=$((FAILED + 1))
fi

# Check if GitHub workflows exist
echo "✓ Checking CI/CD workflows..."
if [ -d ".github/workflows" ]; then
  echo "  ✓ .github/workflows directory exists"
  if [ -f ".github/workflows/frontend-ci.yml" ]; then
    echo "    ✓ frontend-ci.yml found"
  else
    echo "    ✗ frontend-ci.yml missing"
    FAILED=$((FAILED + 1))
  fi
  if [ -f ".github/workflows/backend-ci.yml" ]; then
    echo "    ✓ backend-ci.yml found"
  else
    echo "    ✗ backend-ci.yml missing"
    FAILED=$((FAILED + 1))
  fi
else
  echo "  ✗ .github/workflows directory missing"
  FAILED=$((FAILED + 1))
fi

# Install dependencies
echo "✓ Installing dependencies..."
npm install --silent

# Check TypeScript compilation
echo "✓ Checking TypeScript compilation..."
if npm run type-check 2>&1 | grep -q "error"; then
  echo "  ✗ TypeScript errors found"
  npm run type-check
  FAILED=$((FAILED + 1))
else
  echo "  ✓ No TypeScript errors"
fi

# Build the project
echo "✓ Building project..."
if npm run build; then
  echo "  ✓ Build successful"
  if [ -d "dist" ]; then
    SIZE=$(du -sh dist | cut -f1)
    echo "  ✓ Build output: $SIZE"
  fi
else
  echo "  ✗ Build failed"
  FAILED=$((FAILED + 1))
fi

# Check dist directory
echo "✓ Checking build output..."
if [ -d "dist" ]; then
  FILE_COUNT=$(find dist -type f | wc -l)
  echo "  ✓ dist/ directory contains $FILE_COUNT files"
  
  if [ -f "dist/index.html" ]; then
    echo "  ✓ index.html found in dist/"
  else
    echo "  ✗ index.html not found in dist/"
    FAILED=$((FAILED + 1))
  fi
else
  echo "  ✗ dist/ directory not found"
  FAILED=$((FAILED + 1))
fi

# Summary
echo ""
echo "========================================"
if [ $FAILED -eq 0 ]; then
  echo "✅ All checks passed! Ready for production."
  echo ""
  echo "Next steps:"
  echo "1. Create GitHub repository"
  echo "2. Push code: git push origin main"
  echo "3. Deploy frontend to Vercel"
  echo "4. Deploy backend to Railway/Heroku"
  echo "5. Update VITE_API_URL environment variable"
  exit 0
else
  echo "❌ $FAILED check(s) failed. Please fix issues before deploying."
  exit 1
fi
