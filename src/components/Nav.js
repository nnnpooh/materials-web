import React from 'react';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <div>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/form'>Generate Code</Link>
        </li>
        <li>
          <Link to='/records'>Records</Link>
        </li>
        <li>
          <Link to='/signup'>Sign Up</Link>
        </li>
        <li>
          <Link to='/signin'>Sign In</Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
