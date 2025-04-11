import React from 'react'
import './Sidebar.css'
import add_movie_icon from '../Assets/Movie_Cart.svg'
import list_movie_icon from '../Assets/Movie_list_icon.svg'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to='/addmovie' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={add_movie_icon} alt="" />
          <p>Add Movie</p>
        </div>
      </Link>
      <Link to='/allmovies' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={list_movie_icon} alt="" />
          <p>All Movies</p>
        </div>
      </Link>
      
    </div>
  )
}

export default Sidebar
