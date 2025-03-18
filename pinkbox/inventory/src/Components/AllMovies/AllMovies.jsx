import React, { useEffect, useState } from "react";
import "./AllMovies.css";
import cross_icon from '../Assets/cross_icon.png'
import { backend_url } from "../../App";

const AllMovies = () => {
  const [allmovies, setAllMovies] = useState([]);

  const fetchInfo = () => {
    fetch(`${backend_url}/listmovies`)
      .then((res) => res.json())
      .then((data) => setAllMovies(data))
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  const removeMovie = async (id) => {
    await fetch(`${backend_url}/removemovie`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    })

    fetchInfo();
  }

  return (
    <div className="allmovies">
      <h1>All Movies</h1>
      <div className="allmovies-format-main">
        <p>Movies</p> <p>Title</p> <p>Genre</p> <p>Cost</p> <p>Release Date</p> <p>Remove</p>
      </div>
      <div className="allmovies-listmovies">
        <hr />
        {allmovies.map((e, index) => (
          <div key={index}>
            <div className="allmovies-format-main allmovies-format">
              <img className="allmovies-movie-icon" src={backend_url + e.image} alt="" />
              <p className="cartitems-movie-title">{e.title}</p>
              <p>{e.genre}</p>
              <p>{e.cost}</p>
              <p>{new Date(e.dor).toISOString().split('T')[0]}</p>
              <img className="allmovies-remove-icon" onClick={() => { removeMovie(e.id) }} src={cross_icon} alt="" />
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMovies;
