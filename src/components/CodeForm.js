import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../database';
import DateTimePicker from 'react-datetime-picker';
import { format, add } from 'date-fns';
import { useHistory } from 'react-router-dom';
function CodeForm(props) {
  //console.log(props);
  const history = useHistory();
  const dateNow = new Date();
  const [dataValid, setDataValid] = useState(false);
  const [classInfo, setClassInfo] = useState({
    classId: '259103',
    yearStr: '2564',
    semester: '1',
    section: '',
    graded: true,
    timeStart: format(dateNow, 'yyyy-MM-dd HH:mm:ss'),
    timeEnd: format(dateNow, 'yyyy-MM-dd HH:mm:ss'),
    durationValid: 0,
  });
  const [timeStart, setTimeStart] = useState(new Date());

  function handleClassInfo(e) {
    if (e.target.id === 'classId') {
      setClassInfo({ ...classInfo, classId: e.target.value });
    } else if (e.target.id === 'yearStr') {
      setClassInfo({ ...classInfo, yearStr: e.target.value });
    } else if (e.target.id === 'semester') {
      setClassInfo({ ...classInfo, semester: e.target.value });
    } else if (e.target.id === 'section') {
      setClassInfo({ ...classInfo, section: e.target.value });
    } else if (e.target.id === 'graded') {
      setClassInfo({
        ...classInfo,
        graded: e.target.value === 'true' ? true : false,
      });
    } else if (e.target.id === 'durationValid') {
      const durationValid =
        parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : 0;

      const timeStartDate = new Date(classInfo.timeStart);
      const timeEndDate = add(timeStartDate, {
        minutes: durationValid,
      });
      setClassInfo({
        ...classInfo,
        timeEnd: format(timeEndDate, 'yyyy-MM-dd HH:mm:ss'),
        durationValid,
      });
    }
  }

  function handleTimeStart(date) {
    setTimeStart(date);
    if (date) {
      const timeEndDate = add(date, {
        minutes: classInfo.durationValid,
      });

      setClassInfo({
        ...classInfo,
        timeStart: format(date, 'yyyy-MM-dd HH:mm:ss'),
        timeEnd: format(timeEndDate, 'yyyy-MM-dd HH:mm:ss'),
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const code = uuidv4().substring(0, 4);
    const { data, error } = await supabase.from('codes').insert([
      {
        code: code,
        classid: classInfo.classId,
        yearstr: classInfo.yearStr,
        semester: classInfo.semester,
        section: classInfo.section,
        timestart: classInfo.timeStart,
        timeend: classInfo.timeEnd,
        graded: classInfo.graded,
        auth_id: props.user.id,
      },
    ]);
    console.log({ data, error });

    if (!error) {
      alert('Code Created');
      classInfo.section = '';
      classInfo.durationValid = 0;
      setTimeStart(new Date());
      history.push('/');
    } else {
      alert('Error Creating Code');
    }
  }

  useEffect(() => {
    if (classInfo.section) {
      setDataValid(true);
    } else {
      setDataValid(false);
    }
  }, [classInfo, timeStart]);

  // console.log(classInfo);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='classId'>Class ID</label>
          <input
            id='classId'
            type='text'
            onChange={handleClassInfo}
            value={classInfo.classId}
          ></input>
        </div>

        <div>
          <label htmlFor='yearStr'>Year</label>
          <input
            id='yearStr'
            type='text'
            onChange={handleClassInfo}
            value={classInfo.yearStr}
          ></input>
        </div>

        <div>
          <label htmlFor='semester'>Semester</label>
          <input
            id='semester'
            type='text'
            onChange={handleClassInfo}
            value={classInfo.semester}
          ></input>
        </div>

        <div>
          <label htmlFor='section'>Section</label>
          <input
            id='section'
            type='text'
            onChange={handleClassInfo}
            value={classInfo.section}
            placeholder='Section'
          ></input>
        </div>

        <div>
          <label htmlFor='timestart'>Time Start</label>
          <DateTimePicker
            id='timestart'
            onChange={handleTimeStart}
            value={timeStart}
            minDate={new Date()}
          />
        </div>

        <div>
          <label htmlFor='durationValid'>Duration (Min)</label>
          <input
            id='durationValid'
            type='number'
            value={classInfo.durationValid}
            onChange={handleClassInfo}
          />
        </div>

        <div>
          <select
            id='graded'
            onChange={handleClassInfo}
            value={classInfo.graded}
          >
            <option value='true'>Graded</option>
            <option value='false'>Not Graded</option>
          </select>
        </div>

        <input type='submit' disabled={!dataValid} />
      </form>

      <h2>Time</h2>
      <p>
        {classInfo.timeStart} <br />
        {classInfo.timeEnd}
      </p>
    </div>
  );
}

export default CodeForm;
