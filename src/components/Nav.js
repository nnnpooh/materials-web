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
    <span onClick={handleLogOut}>
      <Link to='#'>Logout</Link>
    </span>
  ) : (
    <></>
  );

  function protectedLink(user, JSX) {
    return user ? JSX : <></>;
  }

  return (
    <div className='flex justify-between'>
      {/* Parimary Nav */}
      <div className='flex'>
        {/* Logo */}
        <div className='mr-4'>
          <Link to='/'>
            <svg
              class='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
              ></path>
            </svg>
          </Link>
        </div>
        {/* Links */}
        <div className='flex space-x-6'>
          {protectedLink(
            user,
            <div>
              <Link to='/codeselect'>Code Select</Link>
            </div>
          )}

          {protectedLink(
            user,
            <div>
              <Link to='/form'>Create Code</Link>
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
              <Link to='/classattend'>Attendance</Link>
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
        </div>
      </div>

      {/* Secondary Nav */}
      <div>{logOutLink}</div>
    </div>
  );
}

export default Nav;
