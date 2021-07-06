import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../database';
import { format } from 'date-fns';

function Attendance() {
  const { code } = useParams();
  const [studentList, setStudentList] = useState([]);
  const timer = useRef(null);
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
    timer.current = setInterval(fetchData, 1000);
    return () => {
      clearInterval(timer.current);
    };
  }, [code]);

  console.log(studentList);
  return (
    <div>
      <h1>Attendance</h1>
      <ul>
        {studentList.map((el) => {
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
