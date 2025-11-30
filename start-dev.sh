#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
  echo "✓ Loaded environment variables from .env"
else
  echo "⚠ No .env file found"
fi

# Start the dev servers
pnpm --filter=mf-react-rsbuild-provider dev & pnpm --filter=mf-react-rsbuild-consumer dev

