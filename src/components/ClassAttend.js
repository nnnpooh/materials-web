import React, { useEffect, useState, useCallback } from 'react';
import supabase from '../database';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
var _ = require('lodash');

function ClassAttend({ user }) {
  const [classCodes, setClassCodes] = useState([]);
  const [classCode, setClassCode] = useState({});
  const [formData, setFormData] = useState({
    classcode: '',
  });
  const [checkins, setCheckins] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [sortDetails, setSortDetails] = useState({
    field: 'cmu_id',
    direction: 'asc',
  });

  useEffect(() => {
    // effect;
    async function fetchData() {
      const { data: dataCodes, error: errorCodes } = await supabase
        .from('codes_pivot')
        .select('*');

      if (!errorCodes) {
        const dataCodesMap = dataCodes.map((el) => {
          const keys = Object.keys(el.jsondata);
          let values = Object.values(el.jsondata).map((el) => new Date(el));

          let arr = [];
          for (let i = 0; i < keys.length; i++) {
            arr.push({
              code: keys[i],
              timestart: values[i],
              timestartdate: format(values[i], 'iii - MMM dd'),
            });
          }
          arr = _.orderBy(arr, ['timestart'], ['asc']);
          return { ...el, codearray: arr };
        });

        setClassCodes(dataCodesMap);
      }
    }
    fetchData();
  }, []);

  async function handleChange(e) {
    const classCodeInput = e.target.value;
    setFormData({ ...formData, classcode: classCodeInput });
  }

  useEffect(() => {
    // Set class code
    const classCodesFiltered = classCodes.find(
      (el) => el.classcode === formData.classcode
    );
    setClassCode(classCodesFiltered);
  }, [classCodes, formData.classcode]);

  async function fetchCheckins() {
    const { data: dataCheckins, error: errorCheckins } = await supabase
      .from('checkins_users_details_pivot')
      .select('*')
      .eq('classcode', classCode.classcode);

    if (!errorCheckins) {
      let objTemplate = {};
      Object.keys(classCode.jsondata).forEach((key) => {
        objTemplate[key] = null;
      });

      const dataCheckinsMap = dataCheckins.map((el) => {
        const jsonDataFilled = { ...objTemplate, ...el.jsondata };
        const keys = Object.keys(jsonDataFilled);
        let values = Object.values(jsonDataFilled);
        let arr = [];
        for (let i = 0; i < keys.length; i++) {
          arr.push({
            code: keys[i],
            codetimestart: new Date(classCode.jsondata[keys[i]]),
            timerecord: values[i] ? new Date(values[i]) : null,
            timerecorddate: values[i]
              ? format(new Date(values[i]), 'MM/dd HH:mm')
              : null,
          });
        }
        arr = _.orderBy(arr, ['codetimestart'], ['asc']);
        return { ...el, checkinarray: arr, jsondatafill: jsonDataFilled };
      });

      setCheckins(dataCheckinsMap);
    }
  }
  const fetchCheckinsCallBack = useCallback(fetchCheckins, [classCode]);

  useEffect(() => {
    // Load checkins
    if (classCode?.jsondata) fetchCheckinsCallBack();
  }, [classCode, fetchCheckinsCallBack]);

  function calculateTable(checkins, classCode) {
    let tableBody = [];
    let tableHeader = [];

    if (classCode?.codearray && checkins.length > 0) {
      const codeArray = classCode.codearray;
      tableHeader.push({ value: 'ID' });
      tableHeader.push({ value: 'Name' });

      codeArray.forEach((el) =>
        tableHeader.push({
          value: `${el.timestartdate} (${el.code})`,
        })
      );

      checkins.forEach((el1) => {
        let tableRow = [];
        tableRow.push({
          value: el1.cmu_id,
        });

        tableRow.push({
          value: `${el1.firstname} ${el1.lastname}`,
        });

        const checkInArray = el1.checkinarray;
        checkInArray.forEach((el2) => {
          tableRow.push({
            value: el2.timerecorddate,
            code: el2.code,
            line_id: el1.line_id,
            firstname: el1.firstname,
            lastname: el1.lastname,
          });
        });
        tableBody.push(tableRow);
      });
    } else {
      tableBody = [[]];
    }
    return [tableHeader, tableBody];
  }

  const checkinsSorted = _.orderBy(
    checkins,
    [sortDetails.field],
    [sortDetails.direction]
  );

  const [tableHeader, tableBody] = calculateTable(checkinsSorted, classCode);
  //console.log({ tableHeader, tableBody });
  //console.log({ checkinsSorted });

  function getCSVData(tableHeader, tableBody) {
    let keys = tableHeader.map((el) => el.value);
    let CSVData = [];

    tableBody.forEach((row) => {
      let rowData = {};
      row.forEach((el, idx) => {
        rowData[keys[idx]] = el.value;
      });
      CSVData.push(rowData);
    });
    return CSVData;
  }

  async function handleCellClick(col, e) {
    console.log({ col, e });

    const a = {
      comb: col.line_id + ':' + col.code,
      line_id: col.line_id,
      code: col.code,
      timerecord: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };

    console.log(a);

    const { data, error } = await supabase.from('checkins').insert([
      {
        comb: col.line_id + ':' + col.code,
        line_id: col.line_id,
        code: col.code,
        timerecord: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      },
    ]);

    if (!error) {
      alert('Check in!');
      console.log(data);
      fetchCheckinsCallBack();
    } else {
      console.log(error.message);
    }
  }

  const inputStyle =
    'appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300';
  const labelStyle = 'text-sm text-gray-400';
  const buttonActiveStyle =
    'bg-blue-400 hover:bg-blue-700 text-white py-1 px-4 rounded focus:outline-none focus:shadow-outline';
  const buttonDisabledStyle =
    'bg-gray-300 text-white py-1 px-4 rounded focus:outline-none focus:shadow-outline';

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl mt-4'>Class Attendance</h1>
      <div className='mt-4 flex items-center space-x-3'>
        <label className={labelStyle} htmlFor='classcode'>
          Class ID
        </label>
        <select
          className={inputStyle}
          id='classcode'
          onChange={handleChange}
          value={formData.classcode}
        >
          <option disabled value={''}></option>
          {classCodes.map((el) => {
            return (
              <option key={el.classcode} value={el.classcode}>
                {el.classcode}
              </option>
            );
          })}
        </select>
      </div>

      <div
        className={`${
          checkins.length > 0 ? '' : 'hidden'
        } mt-4 border border-gray-200 p-4 rounded-lg bg-white max-w-full overflow-x-scroll`}
      >
        <div className='flex space-x-1'>
          <button
            className={buttonActiveStyle}
            onClick={() => {
              setSortDetails({
                field: 'cmu_id',
                direction: sortDetails.direction === 'asc' ? 'desc' : 'asc',
              });
            }}
          >
            {sortDetails.field === 'cmu_id' ? <b>ID</b> : 'ID'}
          </button>
          <button
            className={editMode ? buttonActiveStyle : buttonDisabledStyle}
            onClick={() => {
              setEditMode((prev) => !prev);
            }}
          >
            Edit
          </button>
        </div>
        {checkins.length > 0 ? (
          <>
            <table className='table-auto my-2 w-max text-sm sm:text-md'>
              <thead>
                <tr>
                  {tableHeader.map((el) => (
                    <th
                      className='border border-gray-300 p-1  bg-gray-400 text-white'
                      key={el.value}
                    >
                      {el.value}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableBody.map((row, idr) => (
                  <tr key={idr}>
                    {row.map((col, idc) => (
                      <td
                        className='border border-gray-300 p-1 text-center'
                        key={idc}
                      >
                        {!editMode ? (
                          col.value
                        ) : col.value ? (
                          col.value
                        ) : (
                          <button
                            className={buttonActiveStyle}
                            onClick={(e) => handleCellClick(col, e)}
                          >
                            Check In
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <CSVLink
              data={getCSVData(tableHeader, tableBody)}
              filename={'attendance.csv'}
            >
              <span className='anchor'> Download CSV </span>
            </CSVLink>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default ClassAttend;
