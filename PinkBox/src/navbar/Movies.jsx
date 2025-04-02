import React, { useEffect, useState } from 'react';
import './movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [generalGenres, setGeneralGenres] = useState([
    'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Adventure', 'Fantasy', 'Thriller', 'History', 'Animation'
  ]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // To store the movie selected for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To track modal visibility

  useEffect(() => {
    // Fetch movies from the backend
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:4000/allmovies');
        const data = await response.json();
        if (data.success) {
          setMovies(data.movies);
          setFilteredMovies(data.movies); // Initially, show all movies
        } else {
          console.log("No movies found");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  // Handle genre selection (clickable)
  const handleGenreClick = (genre) => {
    setSelectedGenres(prevGenres =>
      prevGenres.includes(genre)
        ? prevGenres.filter(g => g !== genre) // Deselect
        : [...prevGenres, genre] // Select
    );
  };

  // Filter movies based on selected genres
  useEffect(() => {
    if (selectedGenres.length === 0) {
      setFilteredMovies(movies); // Show all movies if no genre is selected
    } else {
      const filtered = movies.filter(movie =>
        selectedGenres.some(genre => movie.genre.includes(genre))
      );
      setFilteredMovies(filtered);
    }
  }, [selectedGenres, movies]);

  // Open Modal and set selected movie
  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="movie-page">
      {/* Genre Filter Sidebar */}
      <div className="genre-filter">
        <h3>Filter by Genre:</h3>
        <div className="checkbox-group">
          {generalGenres.map(genre => (
            <button
              key={genre}
              className={`genre-button ${selectedGenres.includes(genre) ? 'selected' : ''}`}
              onClick={() => handleGenreClick(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movie List */}
      <div className="movie-list">
        {filteredMovies.map(movie => (
          <div key={movie.id} className="movie-item" onClick={() => openModal(movie)}>
            <img className="movie-image" src={movie.image} alt={movie.title} />
            <div className="movie-title">{movie.title}</div>
          </div>
        ))}
      </div>

      {/* Movie Details Modal */}
      {isModalOpen && selectedMovie && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.description}</p>
            <p><strong>Genre:</strong> {selectedMovie.genre}</p>
            <p><strong>Cost:</strong> ${selectedMovie.cost}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
