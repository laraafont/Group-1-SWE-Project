import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./navbar/NavBar";
import Home from "./navbar/Home";
import Movies from "./navbar/Movies";
import Login from "./navbar/Login";
import Cart from "./navbar/Cart";
import Wishlist from "./navbar/Wishlist";

function App() {
  return (
    <BrowserRouter>
      {/* Conditionally render the navbar based on the current route */}
      <Routes>
        <Route
          path="/login"
          element={
          <div className="login">
            <Login />
            </div>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <NavBar /> {/* Render Navbar on other pages */}
              <div>
                <h2 style={{ textAlign: 'center', fontFamily: 'Helvetica', fontSize: '1.5rem', color: '#333' }}>
                </h2>
              </div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;