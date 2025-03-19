# Overview

PinkBox is an e-commerce movie streaming service designed to offer customers the ability to stream any movie at a discounted price.

Current Challenges: Existing movie streaming providers, such as Netflix, Hulu, and Amazon Prime, require monthly subscriptions regardless of how many movies are watched. Each provider is contracted to host a selected set of movies, limiting customer choice.

Solution: PinkBox is a virtual store that has negotiated discounted prices with all major streaming providers. It offers a unified user interface that allows customers to select any movie from any of the streaming providers.

## Tech Stack
PinkBox Technology Stack: MERN

Overview: PinkBox is built using the MERN tech stack and comprises three key projects that support the frontend, backend, and inventory management.

Frontend:

Built using React.js. Frontend UI makes calls to endpoints/APIs exposed by the backend to perform CRUD operation on document database MongoDB. API accepts and responds in JSON format.

Backend:

MongoDB document database is deployed on Google Cloud to persist data (JSON documents). The access to documents from MongoDB are accessible via endpoints/API. The endpoints/API are hosted on Express server. 

Inventory:

Manages the loading of movies into the MongoDB database.

## Prerequisite

Node.js v22.13.1

To install Node.js, go to https://nodejs.org/en/download, and follow the installation instructions.

## Backend Design

### Database Design

MongoDB Hosting:

MongoDB Atlas is chosen for hosting as it is a fully managed cloud database service provided by MongoDB.

Accessibility: Hosting MongoDB on the cloud enables team members to access the database from their laptops. No need to install and load movies in every team member's laptop. 
Any changes made to the database or documents (users/movies) are avaiable to all team members, saving time and effort.

Deployment: Deploying MongoDB on the cloud involves using MongoDB Atlas, a free service with limited space. Google Cloud is the chosen cloud provider, requiring a Gmail account for deployment.

Schemas: There are two schemas (models) to support this e-commerce application:

Movies: Stores all movie data.

  id: { type: Number, required: true },
  title: { type: String, required: true, unique: true },  // No duplicate titles allowed
  description: { type: String, required: true },
  genre: { type: String, required: true },
  cost: { type: Number },
  image: { type: String, required: true },
  dor: { type: Date, required: true },
  streaming_url: { type: String, required: true },
  new_release: { type: Boolean, required: true, default: false },
  available: { type: Boolean, default: true }
  
Users: Stores user information and shopping cart details.

  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now() 
  
  To access and view documents stored in MongoDB, use MongoDB Compass. Compass can be downloaded and installed from https://www.mongodb.com/try/download/compass
    
 ### Endpoint/API

The folowing endpoints/APIs are hosted on Express server.
 
 /signup (user/customer registration. Upon successful registraion, returns JWT token)
 /login  (user login. Upon successful login, returns JWT token))
 
 /addmovie (to add a movie to the inventory)
 /removemovie (to remove a movie from the inventory)
 
 /moviebytitle  (returns a movie for a given title (name of the movie). For frontend use)
 /moviesbygenre (returns a list of movies for a given genre. Returns empty document if match not found. For frontend use)
 /allmovies (returns all the movies from the inventory. For frontend use)
 /newreleases (returns a list of new releases. Returns empty document if match not found. For frontend use)
 
 /addtocart (add a movie to the cart. For frontend use)
 /removefromcart (remove a movie from the cart. For frontend use)
 /getcart (return the cart. For frontend use)
 
**Note: The test cases along with request/response documents are documented in "API Testcases" under documentes **
 
## How to start backend application

- Clone pinkbox repository
- Change to backend folder
- npm install
- node pinkbox.js

The Express server will be listening on port 4000
http://localhost:4000/



