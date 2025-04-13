import React from 'react'
import './Navbar.css'
import navlogo from '../Assets/nav-logo.png'
import navprofileIcon from '../Assets/uf-profile.png'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={navlogo} className='nav-logo' alt="" />
      <img src={navprofileIcon} className='nav-profile' alt="" />
    </div>
  )
}

export default Navbar
