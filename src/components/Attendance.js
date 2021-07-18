import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../database';
import { format } from 'date-fns';
var _ = require('lodash');

function Attendance() {
  const { code } = useParams();
  const [studentList, setStudentList] = useState([]);
  const timer = useRef(null);
  const [sortDetails, setSortDetails] = useState({
    field: 'timerecord',
    direction: 'desc',
  });

  useEffect(() => {
    async function fetchData() {
      console.log('Fetching Data');

      const { data, error } = await supabase
        .from('checkins_users_details')
        .select('*')
        .eq('code', code);
      //console.log({ data, error });
      if (!error && data.length > 0) {
        const dataNew = data.map((el) => {
          return {
            ...el,
            timestart: new Date(el.timestart),
            timeend: new Date(el.timeend),
            timerecord: new Date(el.timerecord),
          };
        });

        setStudentList(dataNew);
      }
    }
    fetchData();
    timer.current = setInterval(fetchData, 2000);
    return () => {
      clearInterval(timer.current);
    };
  }, [code]);

  const studentListSorted = _.orderBy(
    studentList,
    [sortDetails.field],
    [sortDetails.direction]
  );
  //console.log(studentList);
  //console.log(sortDetails);
  return (
    <div>
      <div className='flex mt-4 items-center space-x-2'>
        <div className='text-2xl'>Attendance</div>
        <div className='rounded-full bg-gray-400 px-2 py-1 text-white align-middle'>
          {studentListSorted.length}
        </div>
      </div>

      <div className='border rounded-lg p-4 text-4xl text-white bg-blue-400 my-4 text-center'>
        CODE:{code}
      </div>
      <button
        className='bg-gray-200 px-2 py-1 rounded-lg mr-1 w-16'
        onClick={() => {
          setSortDetails({
            field: 'timerecord',
            direction: sortDetails.direction === 'asc' ? 'desc' : 'asc',
          });
        }}
      >
        {sortDetails.field === 'timerecord' ? <b>Time</b> : 'Time'}
      </button>
      <button
        className='bg-gray-200 px-2 py-1 rounded-lg w-16'
        onClick={() => {
          setSortDetails({
            field: 'cmu_id',
            direction: sortDetails.direction === 'asc' ? 'desc' : 'asc',
          });
        }}
      >
        {sortDetails.field === 'cmu_id' ? <b>ID</b> : 'ID'}
      </button>
      <ul className='mt-3 text-lg'>
        {studentListSorted.map((el) => {
          return (
            <li key={el.line_id}>
              {el.cmu_id}{' '}
              <b>
                {el.firstname} {el.lastname}
              </b>
              {' @'}
              {format(el.timerecord, 'HH:mm')}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Attendance;
