import React, { useEffect, useState } from "react";
import "./home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/newreleases") // Adjust API URL if necessary
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMovies(data.movies);
        }
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  return (
    <div className="home-container">
      <h2>Newest Releases</h2>
      <div className="movie-carousel">
        {movies.map((movie) => (
          <div className="movie-slide" key={movie.id}>
            <img src={movie.image} alt={movie.title} className="movie-image" />
            {/* You can optionally add movie.title or other info here */}
          </div>
        ))}
      </div>
  
      <div className="content-below">
        <h2>More Content Coming Soon!</h2>
      </div>
    </div>
  );
};

export default Home;
