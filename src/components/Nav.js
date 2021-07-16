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
    <div className='hover:text-white' onClick={handleLogOut}>
      <Link to='#'>Logout</Link>
    </div>
  ) : (
    <></>
  );

  function protectedLink(user, JSX) {
    return user ? JSX : <></>;
  }

  const navItemStyle = 'hover:bg-gray-600 p-4';

  return (
    <div className='flex justify-between items-center text-gray-300 text-sm'>
      {/* Parimary Nav */}
      <div className='flex items-center'>
        {/* Logo */}
        <div className='mr-6 hover:text-white'>
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
        <div className='flex space-x-4 mr-4 items-center text-center'>
          <div className={navItemStyle}>
            {protectedLink(user, <Link to='/codeselect'>Code Select</Link>)}
          </div>

          <div className={navItemStyle}>
            {protectedLink(user, <Link to='/form'>Create Code</Link>)}
          </div>

          <div className={navItemStyle}>
            {protectedLink(user, <Link to='/records'>Records</Link>)}
          </div>

          <div className={navItemStyle}>
            {protectedLink(user, <Link to='/classattend'>Attendance</Link>)}
          </div>

          {/*<li><Link to='/signup'>Sign Up</Link></li>*/}

          {user ? (
            <></>
          ) : (
            <div className={navItemStyle}>
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
