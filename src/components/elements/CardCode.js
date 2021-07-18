import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

function CardCode({ data: el }) {
  return (
    <div key={el.code}>
      <ul className='border rounded-lg p-4 bg-white'>
        <Link className='anchor' to={`/attend/${el.code}`}>
          {el.code}
        </Link>
        <li>
          Class: {el.classid} {el.yearstr}-{el.semester}
        </li>
        <li>Section: {el.section}</li>
        <li>Graded: {el.graded ? 'Yes' : 'No'}</li>
        <li>Time Start: {format(el.timestart, 'EEE yyyy-MM-dd HH:mm')}</li>
        <li>Time End:{format(el.timeend, 'EEE yyyy-MM-dd HH:mm')}</li>
      </ul>
    </div>
  );
}

export default CardCode;
