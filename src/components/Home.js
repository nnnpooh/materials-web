import React, { useEffect, useState } from 'react';
import supabase from '../database';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

function Home() {
  const [activeCodes, setActiveCodes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('codes').select('*');

      //console.log({ data, error });
      if (!error && data.length > 0) {
        const dataNew = data.map((el) => {
          return {
            ...el,
            timestart: new Date(el.timestart),
            timeend: new Date(el.timeend),
          };
        });
        setActiveCodes(dataNew);
      }
    }
    fetchData();
  }, []);

  //console.log({ activeCodes });
  return (
    <div>
      <h1>Current Active Code</h1>

      {activeCodes.map((el) => {
        return (
          <div key={el.code}>
            <Link to={`/attend/${el.code}`}>{el.code}</Link>

            <ul>
              <li>
                Class: {el.classid} {el.yearstr}-{el.semester}
              </li>
              <li>Section: {el.section}</li>
              <li>Graded: {el.graded ? 'Yes' : 'No'}</li>
              <li>
                Time Start: {format(el.timestart, 'EEE yyyy-MM-dd HH:mm')}
              </li>
              <li>Time End:{format(el.timeend, 'EEE yyyy-MM-dd HH:mm')}</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
