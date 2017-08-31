import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () =>
  (
    <header>
      <div className="container flex">
        <div className="logo-text">stox</div>
        <nav>
          <ul>
            <li><NavLink to="/" exact activeClassName="navItemActive">Home</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );

export default Header;
