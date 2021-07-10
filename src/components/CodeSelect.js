import React, { useEffect, useState } from 'react';
import supabase from '../database';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
var _ = require('lodash');

function CodeSelect() {
  const [activeCodes, setActiveCodes] = useState([]);
  const [futureCodes, setFutureCodes] = useState([]);
  useEffect(() => {
    async function fetchData() {
      // const { data, error } = await supabase.from('codes').select('*')
      const dateNow = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      let { data, error } = await supabase
        .from('codes')
        .select('*')
        .lt('timestart', dateNow)
        .gt('timeend', dateNow);

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

      ({ data, error } = await supabase
        .from('codes')
        .select('*')
        .gt('timestart', dateNow));

      if (!error && data.length > 0) {
        const dataNew = data.map((el) => {
          return {
            ...el,
            timestart: new Date(el.timestart),
            timeend: new Date(el.timeend),
          };
        });
        setFutureCodes(dataNew);
      }
    }
    fetchData();
  }, []);

  const activeCodesSorted = _.orderBy(activeCodes, ['timestart'], ['asc']);

  const futureCodesSorted = _.orderBy(futureCodes, ['timestart'], ['asc']);

  //console.log({ activeCodes });
  return (
    <div>
      <h1>Active Codes</h1>

      {activeCodesSorted.map((el) => {
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

      <h1>Future Codes</h1>

      {futureCodesSorted.map((el) => {
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

export default CodeSelect;
