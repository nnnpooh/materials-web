import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../database';
import { format } from 'date-fns';
var _ = require('lodash');

function Attendance() {
  const { code } = useParams();
  const [studentList, setStudentList] = useState([]);
  const timer = useRef(null);
  const [warning, setWarning] = useState('');
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
    let startTime = new Date().getTime();
    timer.current = setInterval(function () {
      fetchData();
      const timeOutMin = 10;
      if (new Date().getTime() - startTime > timeOutMin * 60 * 1000) {
        clearInterval(timer.current);
        setWarning('Live update timeout. Please refresh the page');
        return;
      }
    }, 1000);
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
    <div className='flex items-center flex-col'>
      <div className='flex mt-4'>
        <h1 className='text-2xl'>Attendance</h1>
        <div className='mx-2 rounded-full bg-gray-400 px-2 py-1 text-white align-middle'>
          {studentListSorted.length}
        </div>
      </div>

      <div className='border rounded-lg p-4 text-4xl text-white bg-blue-400 my-4 text-center w-96'>
        CODE:{code}
      </div>

      {warning ? (
        <div className='text-white text-sm bg-red-400 rounded px-2 mb-2'>
          {warning}
        </div>
      ) : (
        <></>
      )}

      <div className='border border-gray-200 rounded-lg bg-white p-6'>
        <div className='flex'>
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
        </div>

        <div className='grid grid-cols-4 gap-x-3 gap-y-1 mt-4'>
          {studentListSorted.map((el) => {
            return (
              <div key={el.line_id} className='contents'>
                <div className='col-span-1'>{el.cmu_id}</div>
                <div className='col-span-2 font-bold'>
                  {el.firstname} {el.lastname}
                </div>
                <div className='col-span-1'>
                  <span className='bg-gray-400 text-white text-sm rounded-full px-2  w-14'>
                    {format(el.timerecord, 'HH:mm')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Attendance;
