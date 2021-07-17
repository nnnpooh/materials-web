import React from 'react';

function Home() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3'>
      <div className='sm:col-span-1 p-2 flex flex-col items-center justify-center bg-gray-200'>
        <span className='text-4xl'>WELCOME</span>
        <span className='text-gray-600'>to Class Attendance</span>
      </div>
      <div className='sm:col-span-2'>
        <img
          className='w-full h-96 object-cover object-center'
          src='https://picsum.photos/1200/1200'
          alt=''
        ></img>
      </div>
    </div>
  );
}

export default Home;
