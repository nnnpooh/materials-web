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
    <div>
      <span onClick={handleLogOut}>
        <Link to='#'>Logout</Link>
      </span>
    </div>
  ) : (
    <></>
  );

  function protectedLink(user, JSX) {
    return user ? JSX : <></>;
  }

  return (
    <div>
      <div className='flex space-x-6 items-center text-sm text-center'>
        <div className='bg-red-300 p-4'>
          <Link to='/'>Home</Link>
        </div>

        {protectedLink(
          user,
          <div>
            <Link to='/codeselect'>Code Select</Link>
          </div>
        )}

        {protectedLink(
          user,
          <div>
            <Link to='/form'>Generate Code</Link>
          </div>
        )}

        {protectedLink(
          user,
          <div>
            <Link to='/records'>Records</Link>
          </div>
        )}

        {protectedLink(
          user,
          <div>
            <Link to='/classattend'>Class Attendance</Link>
          </div>
        )}

        {/*<li><Link to='/signup'>Sign Up</Link></li>*/}

        {user ? (
          <></>
        ) : (
          <div>
            <Link to='/signin'>Sign In</Link>
          </div>
        )}
        {logOutLink}
      </div>
    </div>
  );
}

export default Nav;
