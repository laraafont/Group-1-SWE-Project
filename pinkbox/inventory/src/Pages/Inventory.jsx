import React from "react";
import "./CSS/Inventory.css";
import Sidebar from "../Components/Sidebar/Sidebar";
import AddMovie from "../Components/AddMovie/AddMovie";
import { Route, Routes } from "react-router-dom";
import AllMovies from "../Components/AllMovies/AllMovies";

const Inventory = () => {

  return (
    <div className="inventory">
      <Sidebar />
      <Routes>
        <Route path="/addmovie" element={<AddMovie />} />
        <Route path="/allmovies" element={<AllMovies />} />
      </Routes>
    </div>
  );
};

export default Inventory;
