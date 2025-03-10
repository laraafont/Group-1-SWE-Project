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