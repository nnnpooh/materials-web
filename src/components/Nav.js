import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import supabase from '../database';
import { Menu, Transition } from '@headlessui/react';

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

  function protectedLink(user, JSX) {
    return user ? JSX : <></>;
  }

  const navItemStyle = 'hover:bg-gray-600 p-4';
  const navMobileItemStyle = 'hover:bg-gray-300 flex-1 text-center rounded p-2';
  return (
    <div className='flex justify-between items-center text-gray-300 text-sm'>
      {/* Parimary Nav */}
      <div className='flex items-center'>
        {/* Logo */}
        <div className='mr-6 py-4 hover:text-white'>
          <Link to='/'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
              ></path>
            </svg>
          </Link>
        </div>
        {/* Links */}
        <div className='hidden sm:flex space-x-4 mr-4 items-center text-center'>
          {protectedLink(
            user,
            <div className={navItemStyle}>
              <Link to='/codeselect'>Code Select</Link>
            </div>
          )}

          {protectedLink(
            user,
            <div className={navItemStyle}>
              <Link to='/form'>Create Code</Link>
            </div>
          )}

          {protectedLink(
            user,
            <div className={navItemStyle}>
              <Link to='/records'>Records</Link>
            </div>
          )}

          {protectedLink(
            user,
            <div className={navItemStyle}>
              <Link to='/classattend'>Attendance</Link>
            </div>
          )}

          {/*<li><Link to='/signup'>Sign Up</Link></li>*/}
        </div>
      </div>

      {/* Mobile Menu */}
      {user ? (
        <div className='relative sm:hidden '>
          <Menu>
            <Menu.Button>
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16M4 18h16'
                ></path>
              </svg>
            </Menu.Button>

            <Transition
              enter='transition duration-100 ease-out'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition duration-75 ease-out'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Menu.Items
                className={
                  'flex flex-col absolute  top-8 right-0 w-40 border shadow-md bg-gray-200 text-gray-700 rounded'
                }
              >
                <Menu.Item>
                  {({ active }) => (
                    <div className={navMobileItemStyle}>
                      <Link to='/codeselect'>Code Select</Link>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div className={navMobileItemStyle}>
                      <Link to='/form'>Create Code</Link>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div className={navMobileItemStyle}>
                      <Link to='/records'>Records</Link>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div className={navMobileItemStyle}>
                      <Link to='/classattend'>Attendance</Link>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div className={navMobileItemStyle} onClick={handleLogOut}>
                      <Link to='#'>Logout</Link>
                    </div>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      ) : (
        <></>
      )}

      {/* Secondary Nav */}
      {user ? (
        <div
          className={`hidden sm:block ${navItemStyle}`}
          onClick={handleLogOut}
        >
          <Link to='/'>Logout</Link>
        </div>
      ) : (
        <div className={navItemStyle}>
          <Link to='/signin'>Sign In</Link>
        </div>
      )}
    </div>
  );
}

export default Nav;
