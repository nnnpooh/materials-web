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

  const logOutLink = user ? (
    <li>
      <span onClick={handleLogOut}>
        <Link to='#'>Logout</Link>
      </span>
    </li>
  ) : (
    <></>
  );

  function protectedLink(user, JSX) {
    return user ? JSX : <></>;
  }

  return (
    <div>
      <ul className='flex space-x-4  items-center h-10 '>
        <li>
          <Link to='/'>Home</Link>
        </li>

        {protectedLink(
          user,
          <li>
            <Link to='/codeselect'>Code Select</Link>
          </li>
        )}

        {protectedLink(
          user,
          <li>
            <Link to='/form'>Generate Code</Link>
          </li>
        )}

        {protectedLink(
          user,
          <li>
            <Link to='/records'>Records</Link>
          </li>
        )}

        {protectedLink(
          user,
          <li>
            <Link to='/classattend'>Class Attendance</Link>
          </li>
        )}

        {/*<li><Link to='/signup'>Sign Up</Link></li>*/}

        {user ? (
          <></>
        ) : (
          <li>
            <Link to='/signin'>Sign In</Link>
          </li>
        )}
        {logOutLink}
      </ul>
    </div>
  );
}

export default Nav;
