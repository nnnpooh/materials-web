import React, { useState } from 'react';

function CodeForm() {
  const [classInfo, setClassInfo] = useState({
    classId: '259103',
    yearStr: '2564',
    semester: '1',
    section: '',
  });

  function handleClassInfo(e) {
    //console.dir(e);
    if (e.target.id === 'classId') {
      setClassInfo({ ...classInfo, classId: e.target.value });
    } else if (e.target.id === 'yearStr') {
      setClassInfo({ ...classInfo, yearStr: e.target.value });
    } else if (e.target.id === 'semester') {
      setClassInfo({ ...classInfo, semester: e.target.value });
    } else if (e.target.id === 'section') {
      setClassInfo({ ...classInfo, section: e.target.value });
    }
  }

  function handleGraded(e) {
    console.log(e.target.value);
  }

  return (
    <div>
      <form>
        <input
          id='classId'
          type='text'
          onChange={handleClassInfo}
          value={classInfo.classId}
        ></input>

        <input
          id='yearStr'
          type='text'
          onChange={handleClassInfo}
          value={classInfo.yearStr}
        ></input>

        <input
          id='semester'
          type='text'
          onChange={handleClassInfo}
          value={classInfo.semester}
        ></input>

        <input
          id='section'
          type='text'
          onChange={handleClassInfo}
          value={classInfo.section}
        ></input>

        <select onChange={handleGraded}>
          <option value='true'>Graded</option>
          <option value='false'>Not Graded</option>
        </select>
      </form>
    </div>
  );
}

export default CodeForm;
