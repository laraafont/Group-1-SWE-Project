import React, { useState } from "react";
import "./AddMovie.css";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../App";

const AddMovie = () => {
  const [image, setImage] = useState(false);
  const [movieDetails, setMovieDetails] = useState({
    title: "",
    description: "",
    genre: "Comedy",
    cost: "",
    image: "",
    dor: "",
    streaming_url: "",
    new_release: "false",
    available: "true"
  });

  const AddMovie = async () => {
    let dataObj;
    let movie = movieDetails;

    let formData = new FormData();
    formData.append('movie', image);

    await fetch(`${backend_url}/upload`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    }).then((resp) => resp.json())
      .then((data) => { dataObj = data });

    if (dataObj.success) {
      movie.image = dataObj.image_url;
      console.log(JSON.stringify(movie));
      await fetch(`${backend_url}/addmovie`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
      })
        .then((resp) => resp.json())
        .then((data) => { data.success ? alert("Movie Added") : alert("Failed") });
    }
  }

  const changeHandler = (e) => {
    setMovieDetails({ ...movieDetails, [e.target.name]: e.target.value });
  }

  return (
    <div className="addmovie">
      <div className="addmovie-itemfield">
        <p>Movie title</p>
        <input type="text" name="title" value={movieDetails.title} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
      </div>
      <div className="addmovie-itemfield">
        <p>Movie description</p>
        <input type="text" name="description" value={movieDetails.description} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
      </div>
      <div className="addmovie-itemfield">
        <p>Movie genre</p>
        <select value={movieDetails.genre} name="genre" className="add-movie-selector" onChange={changeHandler}>
          <option value="Animation">Animation</option>
          <option value="Kids">Kids</option>
          <option value="Action">Action</option>
          <option value="Thriller">Thriller</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
        </select>
      </div>
      <div className="addmovie-price">
        <div className="addmovie-itemfield">
          <p>Cost</p>
          <input type="number" name="cost" value={movieDetails.cost} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
        </div>
      </div>
      <div className="addmovie-itemfield">
        <p>Movie Release Date</p>
        <input type="text" name="dor" value={movieDetails.dor} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
      </div>
      <div className="addmovie-itemfield">
        <p>Movie streaming URL</p>
        <input type="text" name="streaming_url" value={movieDetails.streaming_url} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
      </div>
      <div className="addmovie-itemfield">
        <p>New Release</p>
        <select value={movieDetails.new_release} name="new_release" className="add-movie-selector" onChange={changeHandler}>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
      <div className="addmovie-itemfield">
        <p>Is Movie Available</p>
        <select value={movieDetails.available} name="available" className="add-movie-selector" onChange={changeHandler}>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
      <div className="addmovie-itemfield">
        <p>Movie image</p>
        <label htmlFor="file-input">
          <img className="addmovie-thumbnail-img" src={!image ? upload_area : URL.createObjectURL(image)} alt="" />
        </label>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" name="image" id="file-input" accept="image/*" hidden />
      </div>
      <button className="addmovie-btn" onClick={() => { AddMovie() }}>ADD</button>
    </div>
  );
};

export default AddMovie;
