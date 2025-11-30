# Production Deployment with Zephyr Cloud

## 🎯 Overview

This project is configured for **dual-mode operation**:
- **Development**: Uses localhost URLs for fast iteration
- **Production**: Uses Zephyr Cloud's managed URLs for dynamic resolution

---

## 🔧 How It Works

### Development Mode
```
Consumer (localhost:2000)
    ↓
Requests: federation_provider@http://localhost:3000/mf-manifest.json
    ↓
Provider (localhost:3000)
```

### Production Mode
```
Consumer (Zephyr Cloud)
    ↓
Zephyr resolves: federation_provider → mf-react-rsbuild-provider
    ↓
Uses Zephyr-managed URL: https://...zephyrcloud.app/mf-manifest.json
    ↓
Provider (Zephyr Cloud)
```

---

## 📝 Configuration Explained

### `consumer/package.json`
```json
"zephyr:dependencies": {
  "federation_provider": "mf-react-rsbuild-provider@*"
}
```

This tells Zephyr Cloud:
- **Key** (`federation_provider`): The remote name in Module Federation config
- **Value** (`mf-react-rsbuild-provider@*`): The provider's package name
- **`@*`**: Use latest version (or specify version like `@1.0.0`)

### `consumer/rsbuild.config.ts`
```typescript
remotes: {
  federation_provider: 'federation_provider@http://localhost:3000/mf-manifest.json',
}
```

- **Development**: Uses localhost URL directly
- **Production**: Zephyr Cloud **intercepts and replaces** this with the actual deployed URL
- The `withZephyr()` plugin handles this URL substitution automatically

---

## 🚀 Deployment Process

### 1. Build for Production

```bash
# Build both apps
pnpm build

# Or individually
pnpm build-provider  # Must build provider first!
pnpm build-consumer
```

### 2. Deploy to Zephyr Cloud

When you run `pnpm dev` with Zephyr authentication, it automatically deploys to the edge:

```
ZEPHYR   Deployed to Zephyr's edge in 726ms.
ZEPHYR   https://bernardo-henrique-2-mf-react-rsbuild-provider-mf--736436796-ze.zephyrcloud.app
```

### 3. Production URLs

Zephyr Cloud provides:
- **Dynamic URLs**: Each build gets a unique URL
- **Stable Aliases**: You can configure permanent URLs
- **Automatic Resolution**: Consumer automatically finds the latest provider

---

## ⚠️ The "Failed to resolve" Warning

You might see this in development:

```
ZEPHYR   Failed to resolve remote dependencies:
ZEPHYR     - federation_provider@http://localhost:3000/... -> Error code: ZE40003
```

**This is EXPECTED and HARMLESS!**

**Why?**
- Zephyr Cloud tries to resolve localhost URLs
- Localhost is not accessible from the cloud
- But Module Federation still works locally!

**Impact:**
- ✅ Development: Works perfectly (uses localhost)
- ✅ Production: Zephyr Cloud handles URL resolution
- ⚠️ Warning: Can be ignored in development

---

## 🌐 Production Best Practices

### 1. Version Pinning

For production stability, pin versions:

```json
"zephyr:dependencies": {
  "federation_provider": "mf-react-rsbuild-provider@1.0.0"
}
```

### 2. Environment Variables

Configure different behaviors per environment:

```typescript
const remoteUrl = process.env.PROVIDER_URL || 'http://localhost:3000/mf-manifest.json';

remotes: {
  federation_provider: `federation_provider@${remoteUrl}`,
}
```

### 3. Health Checks

Ensure provider is deployed before consumer:

```bash
# Deploy order matters!
pnpm build-provider  # 1. Build provider first
# Wait for deployment confirmation
pnpm build-consumer  # 2. Then build consumer
```

---

## 🔍 Troubleshooting

### "Failed to fetch" in Browser Console

**Cause**: Provider not accessible

**Solutions**:
1. Check provider is running: http://localhost:3000
2. Check CORS settings (already configured with `*`)
3. Verify provider built successfully

### "Module not found" Error

**Cause**: Provider doesn't expose the module

**Check**:
- Provider `rsbuild.config.ts` has correct `exposes` config
- Module path matches: `'./button': './src/Button.tsx'`

### ZE40003 Error in Production

**Cause**: Zephyr can't resolve the dependency

**Solutions**:
1. Verify `zephyr:dependencies` matches remote name
2. Check provider is deployed to Zephyr Cloud
3. Ensure provider package name matches exactly

---

## 📊 Configuration Matrix

| Environment | Remote URL | Zephyr Resolution | Works Offline |
|-------------|------------|-------------------|---------------|
| **Development** | localhost:3000 | ❌ (expected) | ✅ Yes |
| **Production** | Zephyr Cloud | ✅ Yes | ❌ No |
| **Build** | Zephyr Cloud | ✅ Yes | ❌ No |

---

## 🎓 Key Concepts

### 1. Dual-Mode URLs
- Development uses **hardcoded localhost**
- Production uses **Zephyr-managed URLs**
- No code changes needed between environments!

### 2. Dependency Resolution
- `zephyr:dependencies` is metadata for Zephyr Cloud
- Tells Zephyr how to link federated apps
- Only used in production builds/deployments

### 3. URL Substitution
- `withZephyr()` plugin intercepts Module Federation
- Replaces localhost URLs with Zephyr URLs at build time
- Happens automatically during production builds

---

## ✅ Checklist for Production

- [ ] Provider deployed to Zephyr Cloud
- [ ] Consumer has `zephyr:dependencies` configured
- [ ] Both apps use `withZephyr()` plugin
- [ ] Provider exposes correct modules
- [ ] Consumer imports match exposed names
- [ ] CORS configured (auto-configured by plugin)
- [ ] Authentication credentials valid
- [ ] Build order: Provider → Consumer

---

## 🔗 Resources

- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io/)
- [Remote Dependencies Guide](https://docs.zephyr-cloud.io/features/remote-dependencies)
- [Module Federation Docs](https://module-federation.io/)
- [Error ZE40003](https://docs.zephyr-cloud.io/errors/ZE40003)

---

## 🎯 Summary

**Your setup is correct for production!**

The warning you see in development is **expected behavior** because:
1. Zephyr Cloud cannot resolve localhost URLs (by design)
2. Module Federation still works locally via direct HTTP
3. In production, Zephyr automatically manages the URLs

**For production deployment:**
1. Build both apps: `pnpm build`
2. Zephyr handles URL resolution automatically
3. Consumer will connect to provider via Zephyr's managed URLs
4. No manual configuration needed!

**Current Status:**
- ✅ Development: Works with localhost
- ✅ Production: Ready for Zephyr Cloud deployment
- ⚠️ Warning: Expected and harmless

