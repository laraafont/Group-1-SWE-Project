# Group-1-SWE-Project=

This README is to instruct you guys how to run the front end locally. 

1) Open the bash within vs code (ctrl + ~)
2) Then run: npm install
3) Run: npm run dev
4) Now you will see a local host. Open that link and that is our front end B)

Now I will break down what is going on in the frontend.

src/
  ├─ api/                    // Optional: API helper functions
  │    └─ auth.ts           // Functions to call authentication endpoints (login, logout, etc.)
  ├─ components/             // Reusable UI components
  │    ├─ Navbar.tsx        // The navigation bar that will show Login/Logout based on auth state
  │    ├─ Hero.tsx          // Existing component for your banner/hero section
  │    ├─ MovieCard.tsx     // Existing component for a movie card
  │    └─ MovieList.tsx     // Existing component for grouping movie cards
  ├─ context/                // Global state management using React Context
  │    └─ AuthContext.tsx   // Provides authentication state and functions (login, logout, etc.)
  ├─ pages/                  // Full-page components that represent separate views
  │    ├─ Login.tsx         // A page where users can log in
  │    ├─ Register.tsx      // (Optional) A page for new user registration
  │    └─ Profile.tsx       // A protected page showing user-specific data
  ├─ router/                 // Routing utilities (optional but recommended for protected routes)
  │    └─ PrivateRoute.tsx  // A wrapper component to protect routes (redirects unauthenticated users)
  ├─ assets/                 // Your images, icons, and other static files
  ├─ App.tsx                 // Main app component where you bring together pages and components (include routing here)
  ├─ App.css                 // Styles specific to your App component
  ├─ index.css               // Global CSS styles
  └─ main.tsx                // Entry point of your application; wrap App in the AuthProvider


Within the PinkBox directory, we have several folders
PinkBox/
  ├─ node_modules/           // Whenever you install any package, the corresponding foder will be created here
  |
  ├─ public/    
  |
  ├─ src/                    // Main code resides for the frontend
  |
  └─ .gitignore
  |
  └─ eslint.config.js
  |
  └─ index.html
  |
  // Set of scripts to run commands
  └─ package-lock.json
  |
  └─ package.json
  
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
