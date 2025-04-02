import React, { useEffect, useState } from 'react';
import './movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movies from the backend
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:4000/allmovies');
        const data = await response.json();
        if (data.success) {
          setMovies(data.movies);
        } else {
          console.log("No movies found");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="movie-page">
      <h1>All Movies</h1>
      <div className="movie-list">
        {movies.length === 0 ? (
          <p>No movies available.</p>
        ) : (
          movies.map(movie => (
            <div key={movie.id} className="movie-item">
              <img src={`http://localhost:4000/images/${movie.image}`} alt={movie.title} className="movie-image" />
              <h2>{movie.title}</h2>
              <p>{movie.description}</p>
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Cost:</strong> ${movie.cost}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Movies;
