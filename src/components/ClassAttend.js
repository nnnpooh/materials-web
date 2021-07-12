import React, { useEffect } from 'react';
import supabase from '../database';

function ClassAttend({ user }) {
  useEffect(() => {
    // effect;

    async function fetchData() {
      cpnst { data: checkins_users_details_pivot, error } = await supabase
        .from('checkins_users_details_pivot')
        .select('firstname');
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
