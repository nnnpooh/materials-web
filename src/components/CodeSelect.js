import React, { useEffect, useState } from 'react';
import supabase from '../database';
import { format } from 'date-fns';
import CardCode from './elements/CardCode';
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
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl mt-4'>Active Codes</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-6 gap-3'>
        {activeCodesSorted.map((el) => {
          return <CardCode key={el.code} data={el} />;
        })}
      </div>

      <h1 className='text-2xl mt-4'>Future Codes</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-6 gap-3'>
        {futureCodesSorted.map((el) => {
          return <CardCode key={el.code} data={el} />;
        })}
      </div>
    </div>
  );
}

export default CodeSelect;
