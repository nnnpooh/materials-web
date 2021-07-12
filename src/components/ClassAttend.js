import React, { useEffect, useState } from 'react';
import supabase from '../database';

function ClassAttend({ user }) {
  const [classCodes, setClassCodes] = useState([]);

  useEffect(() => {
    // effect;

    async function fetchData() {
      const { data: dataCodes, error: errorCodes } = await supabase
        .from('codes_pivot')
        .select('*');

      // if (!error) {
      //   setClass
      // }

      const { data: dataCheckins, error: errorCheckins } = await supabase
        .from('checkins_users_details_pivot')
        .select('firstname');

      console.log({ dataCheckins, errorCheckins });
    }

    fetchData();

    return () => {
      // cleanup;
    };
  }, []);
  return (
    <div>
      <h1>Class Attendance</h1>
    </div>
  );
}

export default ClassAttend;
