const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');

// Replace with your MongoDB connection string
const mongoDB = 'mongodb+srv://pinkbox:pinkbox@cluster0.jf5f4.mongodb.net/pinkbox';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const OMDBmovieSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  cost: { type: Number },
  image: { type: String, required: true },
  dor: { type: Date, required: true },
  streaming_url: { type: String, required: true },
  new_release: { type: Boolean, required: true, default: false },
  available: { type: Boolean, default: true },
});

const OMDBMovie = mongoose.model('OMDBMovie', OMDBmovieSchema);

let currentId = 1;

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
    const newMovie = new OMDBMovie({
      id: currentId++,
      title: movieData.Title,
      description: movieData.Plot,
      genre: movieData.Genre,
      cost: 0, // Update this value if you have actual cost data
      image: movieData.Poster,
      dor: new Date(movieData.Released),
      streaming_url: 'N/A', // Update this value if you have actual streaming URL data
      new_release: false,
      available: true,
    });
    await newMovie.save();
    console.log(`Successfully added ${movieData.Title} to the database.`);
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
    mongoose.connection.close();
  })
  .catch(error => {
    console.error(`Error processing movies: ${error.message}`);
    mongoose.connection.close();
  });
