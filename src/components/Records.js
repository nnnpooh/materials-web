import React, { useEffect, useState } from 'react';
import supabase from '../database';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
var _ = require('lodash');

function Records() {
  const [activeCodes, setActiveCodes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // const { data, error } = await supabase.from('codes').select('*')
      const dateNow = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const { data, error } = await supabase
        .from('codes')
        .select('*')
        .lt('timeend', dateNow);

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

  const activeCodesSorted = _.orderBy(activeCodes, ['timeend'], ['desc']);

  return (
    <div>
      <h1>Records</h1>

      {activeCodesSorted.map((el) => {
        return (
          <div key={el.code}>
            <Link className='anchor' to={`/attend/${el.code}`}>
              {el.code}
            </Link>
            <ul className='border rounded-lg p-4 bg-white'>
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

export default Records;
