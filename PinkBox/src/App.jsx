import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import NavBar from "./navbar/NavBar";
import Home from "./navbar/Home";
import Movies from "./navbar/Movies";
import Login from "./navbar/Login";
import Signup from "./navbar/Signup";  // Import the Signup component
import Cart from "./navbar/Cart";
import Wishlist from "./navbar/Wishlist";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <div className="login">
              <Login />
              <p>
                Don't have an account?{" "}
                <Link to="/signup">Sign up here</Link>
              </p> {/* Link to Signup page */}
            </div>
          }
        />
        <Route
          path="/signup"
          element={<Signup />} // Add route for Signup page
        />
        <Route
          path="/*"
          element={
            <>
              <NavBar /> {/* Render Navbar on other pages */}
              <div>
                <h2 style={{ textAlign: 'center', fontFamily: 'Helvetica', fontSize: '1.5rem', color: '#333' }}></h2>
              </div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
