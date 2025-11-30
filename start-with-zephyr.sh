#!/bin/bash

echo "🚀 Starting Module Federation with Zephyr Cloud Authentication"
echo ""

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if already authenticated
if [ -f ~/.zephyr/credentials.json ]; then
  echo -e "${GREEN}✓ Found existing Zephyr credentials${NC}"
else
  echo -e "${YELLOW}⚠ No Zephyr credentials found - will need to authenticate${NC}"
fi

echo ""
echo -e "${BLUE}Step 1: Starting Provider (Port 3000)${NC}"
echo "This will handle Zephyr authentication first..."
echo ""

# Start provider first and keep it in foreground for authentication
cd provider
pnpm dev &
PROVIDER_PID=$!

# Wait for authentication or server to be ready
echo ""
echo -e "${YELLOW}⏳ Waiting for provider to authenticate and start...${NC}"
echo "If prompted, press Enter to authenticate in your browser"
echo ""

# Wait for provider to be ready (check for port 3000)
for i in {1..30}; do
  if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Provider is ready on port 3000${NC}"
    break
  fi
  sleep 1
  echo -n "."
done

echo ""
echo ""
echo -e "${BLUE}Step 2: Starting Consumer (Port 2000)${NC}"
echo ""

# Now start consumer from the root
cd ..
pnpm --filter=mf-react-rsbuild-consumer dev &
CONSUMER_PID=$!

echo ""
echo -e "${GREEN}✓ Both applications started!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📍 Provider: http://localhost:3000"
echo "  📍 Consumer: http://localhost:2000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to kill the script
trap "kill $PROVIDER_PID $CONSUMER_PID 2>/dev/null; exit" SIGINT SIGTERM

# Keep script running
wait

