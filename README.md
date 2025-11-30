# mf-zephyr-example

A Module Federation architecture using **Zephyr** with **Rsbuild**, featuring type-safe component sharing between micro-frontends.

## 🏗️ Architecture Overview

This project is a **pnpm workspace monorepo** with a classic **Module Federation** setup consisting of:

### **1. Provider (Remote)** - Port 3000
- **Name**: `federation_provider`
- **Role**: Exposes a reusable Button component
- **Exposes**: `./button` → `./src/Button.tsx`

### **2. Consumer (Host)** - Port 2000
- **Name**: `federation_consumer`
- **Role**: Consumes the Button component from the provider
- **Remotes**: Connects to `federation_provider@http://localhost:3000/mf-manifest.json`

---

## 📦 Tech Stack

```
├── Rsbuild (modern build tool - webpack alternative)
├── Module Federation Enhanced (@module-federation v0.21.2)
├── Zephyr (type-safe MF with automatic type generation)
├── React 19.2.0 (shared singleton)
├── TypeScript 5.9.3
└── pnpm workspace monorepo
```

---

## 🎯 Module Federation Flow

```
Provider (3000)                    Consumer (2000)
┌─────────────────┐               ┌──────────────────┐
│  Button.tsx     │──exposes──────│  imports from    │
│  "Provider      │               │  federation_     │
│   button"       │               │  provider/button │
└─────────────────┘               └──────────────────┘
         │                                  │
         └────── Shared: react, react-dom ──┘
```

**Provider exposes:**
```typescript
exposes: {
  './button': './src/Button.tsx',
}
```

**Consumer imports:**
```tsx
import ProviderButton from 'federation_provider/button';
```

---

## ⚡ Zephyr Integration

**What Zephyr adds to this project:**

1. **Automatic Type Generation**:
   - Creates `@mf-types` folder with TypeScript definitions
   - Consumer gets full IntelliSense for remote components
   - Type safety across federated boundaries

2. **Manifest-based Resolution**:
   - Uses `mf-manifest.json` instead of hardcoded `remoteEntry.js`
   - More flexible and dynamic remote loading

3. **Zero Configuration Type Sharing**:
   - Declared in consumer's `package.json`:
   ```json
   "zephyr:dependencies": {
     "mf-react-rsbuild-provider": "zephyr:mf-react-rsbuild-provider@*"
   }
   ```

4. **TypeScript Path Mapping**:
   - Consumer's `tsconfig.json` maps to generated types:
   ```json
   "paths": {
     "*": ["./@mf-types/*"]
   }
   ```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run both provider and consumer concurrently
pnpm dev

# Or run individually
pnpm --filter=mf-react-rsbuild-provider dev  # Port 3000
pnpm --filter=mf-react-rsbuild-consumer dev  # Port 2000
```

### Build

```bash
# Build both apps (provider first, then consumer)
pnpm build

# Or build individually
pnpm build-provider
pnpm build-consumer
```

---

## 📁 Project Structure

```
mf-zephyr-example/
├── provider/                    # Remote application (Port 3000)
│   ├── src/
│   │   ├── App.tsx             # Provider's main app
│   │   ├── Button.tsx          # ✅ Exposed component
│   │   ├── bootstrap.tsx       # React initialization
│   │   └── index.ts            # Entry point with async boundary
│   ├── dist/@mf-types/         # Generated types for consumers
│   ├── rsbuild.config.ts       # Rsbuild + MF config
│   ├── tsconfig.json
│   └── package.json
│
├── consumer/                    # Host application (Port 2000)
│   ├── src/
│   │   ├── App.tsx             # Consumer's main app (imports remote)
│   │   ├── App.css
│   │   ├── bootstrap.tsx       # React initialization
│   │   └── index.ts            # Entry point with async boundary
│   ├── module-federation.config.ts
│   ├── rsbuild.config.ts       # Rsbuild + MF config
│   ├── tsconfig.json           # Includes path mapping to @mf-types
│   └── package.json            # Includes zephyr:dependencies
│
├── pnpm-workspace.yaml         # Workspace configuration
├── package.json                # Root package with scripts
└── README.md
```

---

## 🔧 Configuration Details

### Provider Configuration (`provider/rsbuild.config.ts`)

```typescript
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { withZephyr } from 'zephyr-rsbuild-plugin';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'federation_provider',
      exposes: {
        './button': './src/Button.tsx',  // ✅ Exposes Button component
      },
      shared: ['react', 'react-dom'],    // ✅ Singleton sharing
    }),
    withZephyr(),                        // ✅ Type generation
  ],
  server: {
    port: 3000,
  },
});
```

### Consumer Configuration (`consumer/rsbuild.config.ts`)

```typescript
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { withZephyr } from 'zephyr-rsbuild-plugin';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'federation_consumer',
      remotes: {
        federation_provider: 'federation_provider@http://localhost:3000/mf-manifest.json',
      },
      shared: ['react', 'react-dom'],
    }),
    withZephyr(),
  ],
  server: {
    port: 2000,
  },
});
```

---

## 🚀 Bootstrap Pattern

Both apps use the **async boundary pattern** (required for Module Federation):

```
index.ts (entry point)
   └──> dynamic import('./bootstrap')
           └──> bootstrap.tsx (actual React app)
```

This ensures:
- Shared dependencies load before app initialization
- Proper module federation container setup
- Avoids race conditions

---

## 💻 Usage Example

**Provider's Button component (`provider/src/Button.tsx`):**
```tsx
export default function Button() {
  return <div>Provider button</div>;
}
```

**Consumer's App (`consumer/src/App.tsx`):**
```tsx
import './App.css';
import ProviderButton from 'federation_provider/button'; // ✅ Type-safe import

const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <div>
        <ProviderButton />  {/* ✅ Remote component with IntelliSense */}
      </div>
    </div>
  );
};

export default App;
```

---

## ✨ Benefits of This Architecture

1. **Type Safety**: Full TypeScript support across federated modules
2. **Independent Deployments**: Provider and consumer can deploy separately
3. **Shared Dependencies**: React is loaded once, not duplicated
4. **Development Experience**: Hot reload works independently for each app
5. **Scalability**: Easy to add more providers or consumers
6. **Modern Build Tool**: Rsbuild is significantly faster than webpack
7. **IntelliSense**: Full IDE support for remote components

---

## 🔍 How It Works

1. **Provider starts** on port 3000 and exposes the Button component via Module Federation
2. **Zephyr generates types** in `provider/dist/@mf-types/` for TypeScript consumers
3. **Consumer starts** on port 2000 and declares the provider as a remote
4. **At runtime**, the consumer loads the Button component from the provider
5. **React is shared** as a singleton - only one instance is loaded
6. **Type safety** is maintained - consumer has full IntelliSense for the remote component

---

## 📚 Resources

- [Zephyr Documentation](https://www.zephyr-cloud.io/)
- [Module Federation](https://module-federation.io/)
- [Rsbuild Documentation](https://rsbuild.dev/)
- [pnpm Workspaces](https://pnpm.io/workspaces)

## 🚀 Production Deployment

For production deployment with Zephyr Cloud, see **[PRODUCTION.md](./PRODUCTION.md)** for detailed instructions on:
- How dual-mode (dev/prod) URLs work
- Zephyr Cloud dependency resolution
- Deployment process and best practices
- Understanding and resolving warnings

## 🔐 Authentication

For Zephyr Cloud authentication setup, see **[AUTHENTICATION.md](./AUTHENTICATION.md)** for:
- Interactive browser login
- API token setup for CI/CD
- Troubleshooting authentication issues
- Sequential startup for avoiding race conditions

---

## 🎯 Next Steps / Improvements

- [ ] Add error boundaries for remote loading failures
- [ ] Implement loading states while fetching remote modules
- [ ] Configure different URLs for dev vs production
- [ ] Expose more components from provider
- [ ] Add shared state management (Zustand/Redux)
- [ ] Implement E2E tests for federated module integration
- [ ] Add Storybook for component documentation
- [ ] Set up CI/CD pipelines

---

## 📝 Scripts Reference

```bash
# Development
pnpm dev              # Run both apps concurrently
pnpm --filter=mf-react-rsbuild-provider dev
pnpm --filter=mf-react-rsbuild-consumer dev

# Build
pnpm build            # Build both apps (provider → consumer)
pnpm build-provider   # Build provider only
pnpm build-consumer   # Build consumer only

# Preview
cd provider && pnpm preview  # Preview built provider
cd consumer && pnpm preview  # Preview built consumer
```

---

## 🤝 Contributing

This project was created with `npx create-zephyr-apps` for learning and demonstration purposes.

## 📄 License

MIT
