
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./navbar/Navbar";
import Home from "./navbar/Home";
import Movies from "./navbar/Movies";
import Login from "./navbar/Login";
import Signup from "./navbar/Signup";
import Cart from "./navbar/Cart";
import Wishlist from "./navbar/Wishlist";
import Checkout from "./navbar/Checkout";
import { useEffect } from "react";


// Wrapper component to access `useLocation` and conditionally show NavBar
function AppWrapper() {
 const location = useLocation();


 // Log the current path
 useEffect(() => {
   console.log("Current path:", location.pathname);
 }, [location]);


 // Define routes where NavBar should be hidden
 const hideNavbarRoutes = ["/login", "/signup"];
 const hideNavbar = hideNavbarRoutes.includes(location.pathname);


 return (
   <>
     {!hideNavbar && <NavBar />}
     <Routes>
       <Route path="/login" element={<div className="login"><Login /></div>} />
       <Route path="/signup" element={<Signup />} />
       <Route path="/movies" element={<Movies />} />
       <Route path="/checkout" element={<Checkout />} />
       <Route
         path="/*"
         element={
           <div>
             <h2 style={{ textAlign: 'center', fontFamily: 'Helvetica', fontSize: '1.5rem', color: '#333' }}>
               {/* You can add a fallback message here if you want */}
             </h2>
           </div>
         }
       />
     </Routes>
   </>
 );
}


function App() {
 return (
   <BrowserRouter>
     <AppWrapper />
   </BrowserRouter>
 );
}


export default App;
