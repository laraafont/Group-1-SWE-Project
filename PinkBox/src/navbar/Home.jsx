import React, { useEffect, useState } from "react";
import "./home.css";

const Home = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/allmovies")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAllMovies(data.movies);

          // Only filter for 2024 & 2025 releases
          const currentReleases = data.movies.filter(
            (movie) => movie.year === 2025 || movie.year === 2024
          );
          setNewReleases(currentReleases);
        }
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  // Filter by platform
  const filterByPlatform = (platform) =>
    allMovies.filter((movie) => movie.streaming_url.includes(platform));

  const netflixMovies = filterByPlatform("netflix.com");
  const disneyMovies = filterByPlatform("disneyplus.com");
  const huluMovies = filterByPlatform("hulu.com");
  const amazonMovies = filterByPlatform("amazon.com");

  // Reusable carousel component
  const renderCarousel = (title, movieList) => (
    <div className="movie-carousel">
      <h2>{title}</h2>
      <div className="movie-images-container">
        {movieList.map((movie) => (
          <div className="movie-slide" key={movie.id}>
            <img src={movie.image} alt={movie.title} className="movie-image" />
            <div className="movie-info">
              <p className="movie-title">{movie.title}</p>
              <p className="movie-year">{movie.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="home-container">
      {renderCarousel("Newest Releases", newReleases)}
      {renderCarousel("Now Streaming on Netflix", netflixMovies)}
      {renderCarousel("Watch on Disney+", disneyMovies)}
      {renderCarousel("Streaming on Hulu", huluMovies)}
      {renderCarousel("Available on Amazon Prime", amazonMovies)}
    </div>
  );
};

export default Home;