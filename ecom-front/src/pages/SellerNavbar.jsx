import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const SellerNavbar = () => {
  return (
    <nav className="navbar">
      <div className="logo"><Link to='/seller'><a className='logo-text'>Admin Dashboard</a></Link></div>
      <div className="nav-links">

        <Link to='/seller-orders'><a className="nav-link">Orders</a></Link>
        <Link to='/seller-products'><a className="nav-link">Products</a></Link>
      </div>
    </nav>
  );
}

export default SellerNavbar;