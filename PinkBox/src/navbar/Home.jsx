import React, { useEffect, useState } from "react";
import "./home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/allmovies") // Adjust API URL if necessary
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const currentReleases = data.movies.filter(
            (movie) => movie.year === 2025 || movie.year === 2024
          );
          setMovies(currentReleases);
        }
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  return (
    <div className="home-container">
      <h2>Newest Releases</h2>
      <div className="movie-carousel">
        <div className="movie-images-container">
          {movies.map((movie) => (
            <div className="movie-slide" key={movie.id}>
              <img src={movie.image} alt={movie.title} className="movie-image" />
              <div className="movie-info">
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other content below the carousel */}
      <div className="content-below">
        <h2>!</h2>
      </div>
    </div>
  );
};

export default Home;
