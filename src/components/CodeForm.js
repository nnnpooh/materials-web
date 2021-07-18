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
      history.push('/codeselect');
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

  const divStyle = 'mt-3';
  const inputStyle =
    'appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300';
  const labelStyle = 'w-full text-sm text-gray-400';
  const buttonActiveStyle =
    'bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded focus:outline-none focus:shadow-outline mt-4';
  const buttonDisabledStyle =
    'bg-gray-300 text-white  py-1 px-4 rounded focus:outline-none focus:shadow-outline mt-4';
  // console.log(classInfo);
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-2xl mt-4'>New Code</h1>
      <form
        className='mt-4 flex flex-col border bg-white rounded-xl p-6'
        onSubmit={handleSubmit}
        noValidate
      >
        <div>
          <label className={labelStyle} htmlFor='classId'>
            Class ID
          </label>
          <input
            className={inputStyle}
            id='classId'
            type='text'
            onChange={handleClassInfo}
            value={classInfo.classId}
          ></input>
        </div>

        <div className={divStyle}>
          <label className={labelStyle} htmlFor='yearStr'>
            Year
          </label>
          <input
            className={inputStyle}
            id='yearStr'
            type='text'
            onChange={handleClassInfo}
            value={classInfo.yearStr}
          ></input>
        </div>

        <div className={divStyle}>
          <label className={labelStyle} htmlFor='semester'>
            Semester
          </label>
          <input
            className={inputStyle}
            id='semester'
            type='text'
            onChange={handleClassInfo}
            value={classInfo.semester}
          ></input>
        </div>

        <div className={divStyle}>
          <label className={labelStyle} htmlFor='section'>
            Section
          </label>
          <input
            className={inputStyle}
            id='section'
            type='text'
            onChange={handleClassInfo}
            value={classInfo.section}
            placeholder='Section'
          ></input>
        </div>

        <div className={divStyle}>
          <label className={labelStyle} htmlFor='timestart'>
            Time Start
          </label>
          <DateTimePicker
            className='appearance-none  rounded w-full py-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='timestart'
            onChange={handleTimeStart}
            value={timeStart}
            minDate={new Date()}
          />
        </div>

        <div className={divStyle}>
          <label className={labelStyle} htmlFor='durationValid'>
            Duration (Min)
          </label>
          <input
            className={inputStyle}
            id='durationValid'
            type='number'
            value={classInfo.durationValid}
            onChange={handleClassInfo}
          />
        </div>

        <div className={divStyle}>
          <label className={labelStyle} htmlFor='graded'>
            Graded
          </label>
          <select
            className={inputStyle}
            id='graded'
            onChange={handleClassInfo}
            value={classInfo.graded}
          >
            <option value='true'>Graded</option>
            <option value='false'>Not Graded</option>
          </select>
        </div>

        <input
          className={dataValid ? buttonActiveStyle : buttonDisabledStyle}
          type='submit'
          disabled={!dataValid}
        />
      </form>

      <h1 className='text-2xl mt-4'>Time</h1>
      <div className='bg-white rounded-lg p-4 text-gray-700 border border-gray-200'>
        <p>
          {classInfo.timeStart} <br />
          {classInfo.timeEnd}
        </p>
      </div>
    </div>
  );
}

export default CodeForm;
