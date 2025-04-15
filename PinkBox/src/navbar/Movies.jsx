import React, { useEffect, useState } from 'react';
import './movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [generalGenres, setGeneralGenres] = useState([
    'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Adventure', 'Fantasy', 'Thriller', 'History', 'Animation'
  ]);
  const [selectedGenre, setSelectedGenre] = useState(''); // single selection
  const [selectedMovie, setSelectedMovie] = useState(null); // To store the movie selected for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To track modal visibility

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:4000/allmovies');
        const data = await response.json();
        if (data.success) {
          setMovies(data.movies);
          setFilteredMovies(data.movies); // Show all initially
        } else {
          console.log("No movies found");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  // Handle single genre selection
  const handleGenreClick = (genre) => {
    setSelectedGenre(prev => (prev === genre ? '' : genre));
  };

  // Filter movies based on selected genre
  useEffect(() => {
    if (!selectedGenre) {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie =>
        movie.genre.includes(selectedGenre)
      );
      setFilteredMovies(filtered);
    }
  }, [selectedGenre, movies]);

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
              className={`genre-button ${selectedGenre === genre ? 'selected' : ''}`}
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
            <button className= "modal-close-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;