import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    // Load checkins
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

    if (classCode?.jsondata) fetchCheckins();
  }, [classCode]);

  function calculateTable(checkins, classCode) {
    let tableBody = [];
    let tableHeader = [];

    if (classCode?.codearray && checkins.length > 0) {
      const codeArray = classCode.codearray;
      tableHeader.push({ value: 'ID' });
      tableHeader.push({ value: 'Name' });

      codeArray.forEach((el) =>
        tableHeader.push({
          value: el.timestartdate,
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

  return (
    <div>
      <h1>Class Attendance</h1>
      <select id='classcode' onChange={handleChange} value={formData.classcode}>
        <option disabled value={''}></option>
        {classCodes.map((el) => {
          return (
            <option key={el.classcode} value={el.classcode}>
              {el.classcode}
            </option>
          );
        })}
      </select>
      <button
        onClick={() => {
          setSortDetails({
            field: 'cmu_id',
            direction: sortDetails.direction === 'asc' ? 'desc' : 'asc',
          });
        }}
      >
        {sortDetails.field === 'cmu_id' ? <b>ID</b> : 'ID'}
      </button>
      <ul></ul>
      {checkins.length > 0 ? (
        <>
          <table
            style={{ border: '1px solid black', borderCollapse: 'collapse' }}
          >
            <thead>
              <tr>
                {tableHeader.map((el) => (
                  <th style={{ border: '1px solid black' }} key={el.value}>
                    {el.value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableBody.map((row, idr) => (
                <tr key={idr}>
                  {row.map((col, idc) => (
                    <td style={{ border: '1px solid black' }} key={idc}>
                      {col.value}
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
            Download CSV
          </CSVLink>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ClassAttend;
