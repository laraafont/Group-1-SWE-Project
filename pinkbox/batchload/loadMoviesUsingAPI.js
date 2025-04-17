const axios = require('axios');
const fs = require('fs');

// Replace with your backend API URL
const backendAPI = 'http://localhost:4000/OMDBaddmovie';

const costs = [0.99, 1.99, 2.99, 3.99];
const streamingUrls = [
  'https://netflix.com/',
  'https://hulu.com/',
  'https://www.amazon.com/gp/video/storefront/',
  'https://www.disneyplus.com/'
];

let currentCostIndex = 0;
let currentStreamingUrlIndex = 0;

async function fetchMovieDetails(title) {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=966c4f4f&t=${encodeURIComponent(title)}`);
    if (response.data.Response === 'True') {
      return response.data;
    } else {
      throw new Error(response.data.Error);
    }
  } catch (error) {
    console.error(`Failed to fetch details for ${title}: ${error.message}`);
    return null;
  }
}

async function addMovieToDatabase(movieData) {
  try {
    const cost = costs[currentCostIndex];
    currentCostIndex = (currentCostIndex + 1) % costs.length;

    const streamingUrl = `${streamingUrls[currentStreamingUrlIndex]}${movieData.imdbID}`;
    currentStreamingUrlIndex = (currentStreamingUrlIndex + 1) % streamingUrls.length;

    const moviePayload = {
      title: movieData.Title,
      description: movieData.Plot,
      genre: movieData.Genre,
      cost: cost,
      image: movieData.Poster,
      dor: new Date(movieData.Released),
      streaming_url: streamingUrl,
      new_release: false,
      available: true,
      year: movieData.Year,      
    };

    const response = await axios.post(backendAPI, moviePayload);
    if (response.data.success) {
      console.log(`Successfully added ${movieData.Title} to the database.`);
    } else {
      console.error(`Failed to add ${movieData.Title} to the database: ${response.data.error}`);
    }
  } catch (error) {
    console.error(`Failed to add ${movieData.Title} to the database: ${error.message}`);
  }
}

async function processMovies() {
  const fileContent = fs.readFileSync('movies.txt', 'utf8');
  const movieTitles = fileContent.split('\n').map(title => title.trim()).filter(Boolean);

  for (const title of movieTitles) {
    const movieDetails = await fetchMovieDetails(title);
    if (movieDetails) {
      await addMovieToDatabase(movieDetails);
    }
  }
}

processMovies()
  .then(() => {
    console.log('All movies processed.');
  })
  .catch(error => {
    console.error(`Error processing movies: ${error.message}`);
  });
