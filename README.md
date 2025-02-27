# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Currency Converter PWA

## Resources

- Free Currency API: [ExchangeRate.host](https://exchangerate.host)
- Hosting: GitHub Pages or similar free service
- No backend costs or database fees

## Deployment Guide

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd currency-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Test the production build locally:
   ```bash
   npm run preview
   ```

### Deploying to GitHub Pages

1. Create a GitHub repository for your project.

2. Update the `vite.config.ts` file to include your repository name as the base path:
   ```typescript
   export default defineConfig({
     base: '/currency-converter/', // Replace with your repository name
     // ... other config
   })
   ```

3. Create a GitHub Actions workflow file at `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'

         - name: Install dependencies
           run: npm ci

         - name: Build
           run: npm run build

         - name: Deploy
           uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: dist
   ```

4. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

5. GitHub Actions will automatically build and deploy your site to GitHub Pages.

### Deploying to Netlify (Alternative)

1. Create an account on [Netlify](https://www.netlify.com/) (free tier available).

2. Connect your GitHub repository to Netlify.

3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

4. Deploy your site.

## Usage Instructions

1. Install the PWA on your device by visiting the deployed URL and using the "Add to Home Screen" option in your browser.

2. Once installed, the app can be used offline.

3. Enter the amount you want to convert in the input field.

4. Select the source currency (default is EUR) and target currency (default is COP).

5. The converted amount will be displayed instantly.

6. When online, the app will automatically update the exchange rates.

7. When offline, the app will use the last known exchange rates.
