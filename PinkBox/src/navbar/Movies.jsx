import React, { useEffect, useState } from 'react';
import './movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [generalGenres, setGeneralGenres] = useState([
    'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Adventure', 'Fantasy', 'Thriller', 'History', 'Animation'
  ]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [movieSearch, setMovieSearch] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:4000/allmovies');
        const data = await response.json();
        if (data.success) {
          setMovies(data.movies);
          setFilteredMovies(data.movies);
        } else {
          console.log("No movies found");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleGenreClick = (genre) => {
    setSelectedGenres(prevGenres =>
      prevGenres.includes(genre) ? [] : [genre]
    );
  };
  

  useEffect(() => {
    let filtered = [...movies];

    // Apply genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(movie =>
        selectedGenres.some(genre => movie.genre.includes(genre))
      );
    }

    // Apply title search filter
    if (movieSearch.trim() !== '') {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(movieSearch.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  }, [selectedGenres, movieSearch, movies]);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="movie-page">
      {/* Top Controls: Search + Genre Filter stacked */}
      <div className="movie-controls">
        {/* Search Bar */}
        <div className="movie-search-bar">
          <input
            type="text"
            placeholder="Search movies..."
            value={movieSearch}
            onChange={(e) => setMovieSearch(e.target.value)}
            className="movie-search-input"
          />
        </div>
  
        {/* Genre Filter */}
        <div className="genre-filter">
          <h3>Filter by Genre:</h3>
          <div className="checkbox-group">
            {generalGenres.map((genre) => (
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
      </div>
  
      {/* Movie Grid */}
      <div className="movie-list">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-item" onClick={() => openModal(movie)}>
            <img className="movie-image" src={movie.image} alt={movie.title} />
            <div className="movie-title">{movie.title}</div>
          </div>
        ))}
      </div>
  
      {/* Modal */}
      {isModalOpen && selectedMovie && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <img
                className="modal-movie-image"
                src={selectedMovie.image}
                alt={selectedMovie.title}
              />
              <div className="modal-movie-info">
                <h2>{selectedMovie.title}</h2>
                <p>{selectedMovie.description}</p>
                <p><strong>Genre:</strong> {selectedMovie.genre}</p>
                <p><strong>Cost:</strong> ${selectedMovie.cost}</p>
              </div>
            </div>
            <button className="add-to-cart-btn" onClick={closeModal}>Add To Cart</button>
            <button className="close-btn" onClick={closeModal}>Close</button>
            <button className="wishlist-btn" onClick={closeModal}>Add To Wishlist</button>
          </div>
        </div>
      )}
    </div>
  );  
};

export default Movies;
