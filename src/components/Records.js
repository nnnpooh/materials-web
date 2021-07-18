import React, { useEffect, useState } from 'react';
import supabase from '../database';
import { format } from 'date-fns';
import CardCode from './elements/CardCode';

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
    <div className='flex flex-col  items-center'>
      <h1>Records</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
        {activeCodesSorted.map((el) => {
          return <CardCode key={el.code} data={el} />;
        })}
      </div>
    </div>
  );
}

export default Records;
