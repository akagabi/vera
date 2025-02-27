# Zero-Cost Deployment Guide for Currency Converter App

This guide provides comprehensive instructions for deploying your Currency Converter app completely free of charge using various platforms and methods.

## Table of Contents
- [GitHub Pages](#github-pages)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Firebase Hosting](#firebase-hosting)
- [Cloudflare Pages](#cloudflare-pages)
- [Preparing Your App for Deployment](#preparing-your-app-for-deployment)
- [Progressive Web App (PWA) Considerations](#progressive-web-app-pwa-considerations)

## Preparing Your App for Deployment

Before deploying to any platform, you need to build your app for production:

1. Update your `vite.config.ts` to ensure proper base path configuration:

```typescript
// vite.config.ts
export default defineConfig({
  // If deploying to GitHub Pages with a project site (not user site)
  // Uncomment and replace 'currency-converter' with your repo name
  // base: '/currency-converter/',
  
  // For other platforms, you can typically use:
  base: './',
  
  // Rest of your configuration...
})
```

2. Build your app:

```bash
npm run build
```

This will create a `dist` folder with your production-ready files.

## GitHub Pages

GitHub Pages is completely free and easy to set up.

### Deployment Steps:

1. Create a GitHub repository for your project (if you haven't already)

2. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/currency-converter.git
git push -u origin main
```

3. Set up GitHub Pages deployment using GitHub Actions by creating a file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

4. Go to your GitHub repository settings, navigate to "Pages", and set the source to the "gh-pages" branch.

5. Your app will be available at `https://yourusername.github.io/currency-converter/`

## Netlify

Netlify offers a generous free tier that's perfect for small apps.

### Deployment Steps:

1. Create a `netlify.toml` file in your project root:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy using Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy
```

3. Alternatively, connect your GitHub repository to Netlify:
   - Sign up/in at [netlify.com](https://www.netlify.com/)
   - Click "New site from Git"
   - Select your repository
   - Configure build settings (build command: `npm run build`, publish directory: `dist`)
   - Click "Deploy site"

4. Your app will be available at a Netlify subdomain (e.g., `https://your-app.netlify.app`)

## Vercel

Vercel provides an excellent free tier for frontend applications.

### Deployment Steps:

1. Create a `vercel.json` file in your project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

2. Deploy using Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel
```

3. Alternatively, connect your GitHub repository to Vercel:
   - Sign up/in at [vercel.com](https://vercel.com/)
   - Click "Import Project"
   - Select your repository
   - Configure build settings (Framework Preset: Vite, Build Command: `npm run build`, Output Directory: `dist`)
   - Click "Deploy"

4. Your app will be available at a Vercel subdomain (e.g., `https://your-app.vercel.app`)

## Firebase Hosting

Firebase Hosting offers a free tier with generous limits.

### Deployment Steps:

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Initialize Firebase in your project:

```bash
firebase login
firebase init hosting
```

3. During initialization:
   - Select "Use an existing project" or create a new one
   - Specify `dist` as your public directory
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: Optional

4. Deploy to Firebase:

```bash
firebase deploy --only hosting
```

5. Your app will be available at `https://your-project-id.web.app`

## Cloudflare Pages

Cloudflare Pages offers free hosting with generous build minutes.

### Deployment Steps:

1. Push your code to GitHub or GitLab

2. Sign up/in at [Cloudflare Pages](https://pages.cloudflare.com/)

3. Connect your repository:
   - Click "Create a project"
   - Select your repository
   - Configure build settings (Framework preset: Vite, Build command: `npm run build`, Build output directory: `dist`)
   - Click "Save and Deploy"

4. Your app will be available at `https://your-project.pages.dev`

## Progressive Web App (PWA) Considerations

Since your Currency Converter is designed to work offline, ensure your PWA configuration is properly set up:

1. Verify your `vite.config.ts` has the PWA plugin configured:

```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Currency Converter',
        short_name: 'CurrencyConv',
        description: 'Offline Currency Converter App',
        theme_color: '#1e293b',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  // Rest of your configuration...
});
```

2. Make sure your app has the necessary icons in the public directory.

3. Test your PWA functionality after deployment using Lighthouse in Chrome DevTools.

## Conclusion

All of these deployment options offer free tiers that are more than sufficient for a currency converter app. Choose the platform that best fits your workflow and preferences.

For the best user experience with your offline currency converter:
- Ensure service workers are properly registered
- Test the offline functionality after deployment
- Verify that your PWA can be installed on mobile devices

Happy deploying! 