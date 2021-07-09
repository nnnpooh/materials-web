import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import supabase from '../database';

function Nav({ user }) {
  let history = useHistory();

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      history.push('/');
    }
  };

  const logOutButton = user ? (
    <li>
      <span onClick={handleLogOut}>
        {' '}
        <a href='#'>Logout </a>
      </span>
    </li>
  ) : (
    <></>
  );

  return (
    <div>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        {user ? (
          <>
            {' '}
            <li>
              <Link to='/form'>Generate Code</Link>
            </li>
            <li>
              <Link to='/records'>Records</Link>
            </li>{' '}
          </>
        ) : (
          <></>
        )}
        {/*         <li>
          <Link to='/signup'>Sign Up</Link>
        </li>
       */}

        {user ? (
          <></>
        ) : (
          <li>
            <Link to='/signin'>Sign In</Link>
          </li>
        )}
        {logOutButton}
      </ul>
    </div>
  );
}

export default Nav;
