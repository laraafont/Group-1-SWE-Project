const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://pinkbox:pinkbox@cluster0.jf5f4.mongodb.net/pinkbox");

// Fetch user from token
// frontend application, when calls endpoints using http POST/GET, adds "auth-token" header. 
// During user login, auth-token (jwt token) is generated and passed as response. Frontend application adds this token
// to http header by name "auth-token"
// This auth-token is valid unitl user logs off. Until then every call that forntend makes, this auth-token is retrieved
// form the header and validated.

const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_pinkbox");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now() },
});

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true, unique: true },  // No duplicate titles allowed
  description: { type: String, required: true },
  genre: { type: String, required: true },
  cost: { type: Number },
  image: { type: String, required: true },
  dor: { type: Date, required: true },
  streaming_url: { type: String, required: true },
  new_release: { type: Boolean, required: true, default: false },
  available: { type: Boolean, default: true },
});

const Movie = mongoose.model("Movie", movieSchema);

app.get("/", (req, res) => {
  res.send("pinkbox mongodb database is ready to accept requests!!!");
});

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({ storage: storage })
app.post("/upload", upload.single('movie'), (req, res) => {
  res.json({
    success: 1,
    image_url: `/images/${req.file.filename}`
  });
})

app.use('/images', express.static('upload/images'));

app.post("/addmovie", async (req, res, next) => {
  try {
    let movies = await Movie.find({});
    let id;
    if (movies.length > 0) {
      let movie_array = movies.slice(-1);
      let last_movie = movie_array[0];
      id = last_movie.id + 1;
    }
    else { id = 1; }
    const movie = new Movie({
      id: id,
      title: req.body.title,
      description: req.body.description,
      genre: req.body.genre,
      cost: req.body.cost,
      image: req.body.image,
      dor: req.body.dor,
      streaming_url: req.body.streaming_url,
      new_release: req.body.new_release,
      available: req.body.available,
    });
    await movie.save();
    console.log("Movie Saved");
    res.json({ success: true, title: req.body.title });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({ success: false, error: 'Title must be unique. Duplicate title found.' });
    } else {
      res.status(500).json({ success: false, error: error });
      next(error);
    }
  }
});

app.post("/removemovie", async (req, res, next) => {
  try {
    const result = await Movie.findOneAndDelete({ title: req.body.title });

    if (result) {
      console.log("Movie Removed");
      res.json({ success: true, name: req.body.title });
    } else {
      console.log("Movie Not Found");
      res.json({ success: false, name: req.body.title, error: "Not Found" });
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
});

app.get("/moviebytitle", async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ title: req.body.title });

    if (movie) {
      console.log("Movie found:", movie);
      res.send({success: true, movie: movie });
    } else {
      console.log("Movie Not Found");
      res.status(404).send({ success: false, title: req.body.title, error: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });    
    next(error);
  }
});

app.get("/moviesbygenre", async (req, res, next) => {
  try {
    const genre = req.body.genre;
    const movies = await Movie.find({genre: { $regex: new RegExp(`(^|,)\\s*${genre}\\s*(,|$)`, "i") } });

    if (movies.length > 0) {
      console.log("Movies found:", movies);
      res.send({success: true, movies: movies });
    } else {
      console.log("No movies found with the specified genre");
      res.status(404).send({ success: false, error: "No movies found with the specified genre" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
});

app.get("/allmovies", async (req, res, next) => {
  try {
    let movies = await Movie.find({});

    if (movies.length > 0) {
      console.log("Movies found:", movies);
      res.send({success: true, movies: movies });
    } else {
      console.log("No movies found with the specified genre");
      res.send({ success: false, error: "No movies found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
});

app.get("/listmovies", async (req, res, next) => {
  try {
    let movies = await Movie.find({});

    if (movies.length > 0) {
      console.log("Movies found:", movies);
      res.send(movies);
    } else {
      console.log("No movies found with the specified genre");
      res.send({ success: false, error: "No movies found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
});

app.get("/newreleases", async (req, res, next) => {
  try {
    let movies = await Movie.find({ new_release: true });

    if (movies.length > 0) {
      console.log("New Release:", movies);
      res.send({success: true, movies: movies });
    } else {
      console.log("No new release movies found");
      res.send({ success: false, error: "No new release movies found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }    
});

app.post('/signup', async (req, res, next) => {
  try {
    console.log("Sign Up");
    let success = false;
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      console.log("User already exists with this email");
      return res.status(400).json({ success: false, errors: "User already exists with this email" });
    }
    let cart = {};
    for (let i = 0; i < 100; i++) {
      cart[i] = 0;
    }
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });
    await user.save();
    const data = {
      user: {
        id: user.id
      }
    }

    const token = jwt.sign(data, 'secret_pinkbox');
    success = true;
    res.json({ success, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
})

app.post('/login', async (req, res, next) => {
  try {
    console.log("Login");
    let success = false;
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
      const comparePassword = req.body.password === user.password;
      if (comparePassword) {
        const data = {
          user: {
            id: user.id
          }
        }
        success = true;
        console.log(user.id);
        const token = jwt.sign(data, 'secret_pinkbox');
        res.json({ success, token });
      }
      else {
        console.log("Wrong password");
        return res.status(400).json({ success: success, errors: "Wrong password" })
      }
    }
    else {
      console.log("Please try with valid email and password")
      return res.status(400).json({ success: success, errors: "Please try with valid email and password" })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
});

app.post('/addtocart', fetchuser, async (req, res, next) => {
  try {
    console.log("Add Cart");
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.movieId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send({ success: true, response: "Added"});
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
})

app.post('/addtocartTest', async (req, res, next) => {
  try {
    console.log("Add Cart");
    let userData = await Users.findOne({ _id: "67a1232b04099ced9b79ca68" });
    userData.cartData[req.body.movieId] += 1;
    await Users.findOneAndUpdate({ _id: "67a1232b04099ced9b79ca68" }, { cartData: userData.cartData });
    res.send({ success: true, response: "Added"});
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
})

app.post('/removefromcart', fetchuser, async (req, res, next) => {
  try {
    console.log("Remove Cart");
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.movieId] != 0) {
      userData.cartData[req.body.movieId] -= 1;
    }
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send({success: true, response: "Removed"});
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
})

app.post('/removefromcartTest', async (req, res, next) => {
  try {
    console.log("Remove Cart");
    let userData = await Users.findOne({ _id: "67a1232b04099ced9b79ca68" });
    if (userData.cartData[req.body.movieId] != 0) {
      userData.cartData[req.body.movieId] -= 1;
    }
    await Users.findOneAndUpdate({ _id: "67a1232b04099ced9b79ca68" }, { cartData: userData.cartData });
    res.send({success: true, response: "Removed"});
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
})

app.post('/getcart', fetchuser, async (req, res, next) => {
  try {
    console.log("Get Cart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json({success: true, cartData: userData.cartData});
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
});

app.post('/getcartTest', async (req, res, next) => {
  try {
    console.log("Get Cart");
    let userData = await Users.findOne({ _id: "67a1232b04099ced9b79ca68" });
    res.json({success: true, cartData: userData.cartData});
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error : ", error);
});
