# Zephyr Cloud Authentication Guide

This project supports two authentication modes for Zephyr Cloud.

## 🚀 Quick Start

### Option 1: With Zephyr Authentication (Recommended)
```bash
pnpm dev
```
- Uses `start-with-zephyr.sh`
- Starts provider first for authentication
- Opens browser for login (GitHub/Google/Email)
- Authentication is saved for future use
- Gets cloud features: type generation, analytics, version management

### Option 2: Without Authentication (Local Only)
```bash
pnpm dev:no-auth
```
- Uses `start-dev.sh`
- Skips Zephyr authentication
- Pure Module Federation
- Good for quick local testing

---

## 🔐 Authentication Methods

### Interactive Browser Login (Default)

**First Time Setup:**
1. Run `pnpm dev`
2. Provider starts and prompts for authentication
3. Press `Enter` when you see the authorization URL
4. Browser opens to Zephyr Cloud login
5. Sign in with GitHub, Google, or Email
6. Authorize the application
7. Return to terminal - authentication complete!
8. Credentials saved to `~/.zephyr/credentials.json`

**Subsequent Runs:**
- Authentication is automatic
- Token is reused from saved credentials
- No browser interaction needed

**Token Location:**
```
~/.zephyr/credentials.json
```

---

### API Token (For CI/CD)

If you need non-interactive authentication:

1. **Get token from Zephyr Cloud:**
   - Visit https://zephyr-cloud.io
   - Go to Settings → API Tokens
   - Generate new token

2. **Add to `.env` file:**
   ```bash
   ZE_SECRET_TOKEN=your_token_here
   ```

3. **Run as normal:**
   ```bash
   pnpm dev
   ```

---

## 🛠️ Troubleshooting

### "Failed to authenticate" or "Timeout"
**Solution:** Use the sequential startup script (already configured in `pnpm dev`)

### "401 Unauthorized"
**Causes:**
- Token expired (regenerate from dashboard)
- Project doesn't exist in Zephyr Cloud
- Wrong organization

**Solution:**
1. Login to https://zephyr-cloud.io
2. Create project with matching name: `mf-react-rsbuild-provider`
3. Re-authenticate

### "No token found after authentication"
**Cause:** Race condition with concurrent starts

**Solution:** Already fixed! The `start-with-zephyr.sh` script prevents this.

### Want to reset authentication?
```bash
rm ~/.zephyr/credentials.json
pnpm dev
# Authenticate again
```

---

## 📊 What You Get With Zephyr Cloud

✅ **Type Safety Across Boundaries** - Auto-generated TypeScript types for remote modules
✅ **Version Management** - Track and manage federated module versions
✅ **Deployment Analytics** - Monitor your micro-frontends
✅ **Visual Dependency Graphs** - See how your apps connect
✅ **Dynamic Remote URLs** - Update remotes without redeploying

---

## 🔧 Technical Details

### Sequential Startup Flow

```
┌─────────────────────────────────────┐
│ 1. Start Provider (Port 3000)      │
│    - Handles Zephyr authentication  │
│    - Saves credentials              │
│    - Waits for server ready         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. Start Consumer (Port 2000)      │
│    - Reuses saved credentials       │
│    - No authentication needed       │
│    - Connects to provider           │
└─────────────────────────────────────┘
```

### Why Sequential?

Starting both apps simultaneously causes:
- Race condition in authentication
- Two processes competing for terminal input
- Timeout errors
- Failed authentication

The `start-with-zephyr.sh` script solves this by:
1. Starting provider first (foreground)
2. Allowing authentication to complete
3. Waiting for provider to be ready (port check)
4. Starting consumer second
5. Consumer reuses the saved credentials

---

## 📝 Scripts Reference

```bash
# Development with Zephyr (sequential start, handles auth)
pnpm dev

# Development without Zephyr (concurrent start, no auth)
pnpm dev:no-auth

# Build both apps
pnpm build

# Build individually
pnpm build-provider
pnpm build-consumer
```

---

## 🎯 Recommended Workflow

**For Development:**
```bash
pnpm dev  # First time: authenticate in browser
          # Subsequent times: uses saved credentials
```

**For Quick Testing:**
```bash
pnpm dev:no-auth  # Skip auth, pure MF
```

**For CI/CD:**
```bash
export ZE_SECRET_TOKEN=your_token
pnpm build
```

