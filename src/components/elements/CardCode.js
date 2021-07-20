import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

function CardCode({ data: el }) {
  return (
    <div className='border rounded-lg p-6 bg-white flex flex-col'>
      <Link
        className='bg-blue-300 rounded-lg px-2 text-white mb-2 text-center'
        to={`/attend/${el.code}`}
      >
        {el.code}
      </Link>
      <div>
        Class: {el.classid} {el.yearstr}-{el.semester}
      </div>
      <div>Section: {el.section}</div>
      <div>Graded: {el.graded ? 'Yes' : 'No'}</div>
      <div>Time Start: {format(el.timestart, 'EEE yyyy-MM-dd HH:mm')}</div>
      <div>Time End:{format(el.timeend, 'EEE yyyy-MM-dd HH:mm')}</div>
    </div>
  );
}

export default CardCode;
