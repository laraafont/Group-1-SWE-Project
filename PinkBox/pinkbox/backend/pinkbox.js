const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const nodemailer = require('nodemailer');
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
  year: { type: String, default: false },
});

const Movie = mongoose.model("Movie", movieSchema);

// ************************************** //

const OMDBmovieSchema = new mongoose.Schema({
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
  year: { type: String, default: false },
});

const omdbMovie = mongoose.model("OMDBMovie", OMDBmovieSchema);

// ************************************** //

app.get("/", (req, res) => {
  res.send("pinkbox mongodb database is ready to accept requests!!!");
});

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    console.log('req.body 1:', req.body);
    // Replace spaces with empty string and convert to lowercase
    //const movieTitle = req.body.title.replace(/\s+/g, '').toLowerCase();
    //return cb(null, `${movieTitle}${path.extname(file.originalname)}`);
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({ storage: storage })

app.post("/upload", upload.single('movie'), (req, res) => {
  console.log('req.body 2:', req.body);
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
      year: req.body.year,
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

// ****************************** //
app.post("/OMDBaddmovie", async (req, res, next) => {
  try {
    let OMDBmovies = await omdbMovie.find({});
    let id;
    if (OMDBmovies.length > 0) {
      let OMDBmovie_array = OMDBmovies.slice(-1);
      let last_OMDBmovie = OMDBmovie_array[0];
      id = last_OMDBmovie.id + 1;
    }
    else { id = 1; }
    const OMDBmovie = new omdbMovie({
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
      year: req.body.year,
    });
    await OMDBmovie.save();
    console.log("omdbMovie Saved");
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
// ****************************** //

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
      console.log("user already exists with this email");
      return res.status(400).json({ success: false, errors: "user already exists with this email" });
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
      console.log("please try with valid email and password")
      return res.status(400).json({ success: success, errors: "please try with valid email and password" })
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
    userData.cartData[req.body.itemId] += 1;
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
    userData.cartData[req.body.itemId] += 1;
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
    if (userData.cartData[req.body.itemId] != 0) {
      userData.cartData[req.body.itemId] -= 1;
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
    if (userData.cartData[req.body.itemId] != 0) {
      userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({ _id: "67a1232b04099ced9b79ca68" }, { cartData: userData.cartData });
    res.send({success: true, response: "Removed"});
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
})

app.post('/getUser', fetchuser, async (req, res, next) => {
  try {
    console.log("Get User");
    let userData = await Users.findOne({ _id: req.user.id });
    console.log(userData);
    //res.json({success: true, cartData: userData.cartData});
    res.json(userData);
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    next(error);
  }
});

app.post('/sendEmail', fetchuser, async (req, res, next) => {
  try {
    console.log("Send Email");
    const { to: email, body: cartDetails } = req.body;

    // Check if cartDetails is an array
    if (!Array.isArray(cartDetails)) {
      throw new Error('cartDetails must be an array');
    }
    
    // Log each item to inspect its structure
    cartDetails.forEach(item => console.log(item));
    

    // Create a transporter using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: 'aarithti',
      },
    });

    // Function to fetch the streaming URL from the database
    const getStreamingUrl = async (title) => {
      const movie = await Movie.findOne({ title });
      return movie ? movie.streaming_url : 'N/A';
    };

    // Create HTML content for the email
    const htmlContent = `
      <h2>Thank you for your purchase!</h2>
      <p>Here are your order details:</p>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Title</th>
            <th>Streaming URL</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${await Promise.all(cartDetails.map(async (item) => {
            const streamingUrl = await getStreamingUrl(item.title);
            return `
              <tr>
                <td>${item.title}</td>
                <td><a href="${streamingUrl}" target="_blank">${streamingUrl}</a></td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${item.total.toFixed(2)}</td>
              </tr>
            `;
          })).then(rows => rows.join(''))}
        </tbody>
      </table>
      <p><strong>Total Amount: $${cartDetails.reduce((acc, item) => acc + item.total, 0).toFixed(2)}</strong></p>
    `;

    // Define the email options
    const mailOptions = {
      from: 'pinkbox@gmail.com',
      to: email,
      subject: 'Order Confirmation',
      html: htmlContent // Send HTML email
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

    res.status(200).json({ success: true, message: 'Email sent!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    next(error);
  }
});

app.post('/getcart', fetchuser, async (req, res, next) => {
  try {
    console.log("Get Cart");
    let userData = await Users.findOne({ _id: req.user.id });
    //res.json({success: true, cartData: userData.cartData});
    res.json(userData.cartData);
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
