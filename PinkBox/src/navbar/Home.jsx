import React, { useEffect, useState } from "react";
import "./home.css";

const Home = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:4000/allmovies");
        const data = await response.json();
        if (data.success) {
          setAllMovies(data.movies);
          const currentReleases = data.movies.filter(
            (movie) => movie.year === 2025 || movie.year === 2024
          );
          setNewReleases(currentReleases);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, []);

  const filterByPlatform = (platform) =>
    allMovies.filter((movie) => movie.streaming_url.includes(platform));

  const netflixMovies = filterByPlatform("netflix.com");
  const disneyMovies = filterByPlatform("disneyplus.com");
  const huluMovies = filterByPlatform("hulu.com");
  const amazonMovies = filterByPlatform("amazon.com");

  const handleMovieClick = (movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  const handleAddToCart = async (movie) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("http://localhost:4000/addtocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ movieId: movie.id }),
      });

      const data = await response.json();
      if (data.success) {
        setConfirmationMessage(`Added "${movie.title}" to cart!`);
        setShowConfirmation(true);
        closeModal();
        setTimeout(() => setShowConfirmation(false), 3000);
        console.log(`Added "${movie.title}" to cart!`);
      } else {
        console.log('Failed to add to cart.');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong!");
    }
  };

  const handleAddToWishlist = async (movie) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("http://localhost:4000/addtowishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ movieId: movie.id }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Added "${movie.title}" to wishlist!`);
      } else {
        alert("Failed to add to wishlist.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Something went wrong!");
    }
  };

  const renderCarousel = (title, movieList) => (
    <div className="movie-carousel">
      <h2>{title}</h2>
      <div className="movie-images-container">
        {movieList.map((movie) => (
          <div
            key={movie.id}
            className="movie-slide"
            onClick={() => handleMovieClick(movie)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img src={movie.image} alt={movie.title} className="movie-image" />
            <div className="movie-info">
              <p className="movie-title">{movie.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {showConfirmation && (
        <div className="toast-confirmation">
          {confirmationMessage}
        </div>
      )}
  
      <div className="home-scrollable">
        <div className="home-container">
          {renderCarousel("Newest Releases", newReleases)}
          {renderCarousel("Now Streaming on Netflix", netflixMovies)}
          {renderCarousel("Watch on Disney+", disneyMovies)}
          {renderCarousel("Streaming on Hulu", huluMovies)}
          {renderCarousel("Available on Amazon Prime", amazonMovies)}
        </div>
  
        {selectedMovie && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{selectedMovie.title}</h2>
              <p>{selectedMovie.description}</p>
              <p>
                <strong>Genre:</strong> {selectedMovie.genre}
              </p>
              <p>
                <strong>Cost:</strong> ${selectedMovie.cost}
              </p>
              <button className="wishlist-btn" onClick={() => handleAddToWishlist(selectedMovie)}>
                Add to Wishlist
              </button>
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(selectedMovie)}>
                Add to Cart
              </button>
              <button className="close-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
