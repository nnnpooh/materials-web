import React, { useEffect, useState } from 'react';
import supabase from '../database';
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
            });
          }
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
    // Load checkins
    async function fetchCheckins() {
      if (formData.classcode) {
        const { data: dataCheckins, error: errorCheckins } = await supabase
          .from('checkins_users_details_pivot')
          .select('*')
          .eq('classcode', formData.classcode);

        if (!errorCheckins) {
          const dataCheckinsMap = dataCheckins.map((el) => {
            const keys = Object.keys(el.jsondata);
            let values = Object.values(el.jsondata).map((el) => new Date(el));
            let arr = [];
            for (let i = 0; i < keys.length; i++) {
              arr.push({
                code: keys[i],
                timerecord: values[i],
              });
            }
            return { ...el, checkinsarray: arr };
          });
          setCheckins(dataCheckinsMap);
        }
      }
    }

    fetchCheckins();
  }, [formData.classcode, classCodes]);

  //  console.log({ classCode, checkins });
  //  const codeArray = [];

  function calculateTable(checkins, classCode) {
    let tableBody = [];
    let tableHeader = [];

    if (classCode?.codearray && checkins.length > 0) {
      const codeArray = classCode.codearray;
      tableHeader.push({
        value: 'ID',
      });
      tableHeader.push({
        value: 'Name',
      });

      codeArray.forEach((el) =>
        tableHeader.push({
          value: el.code,
        })
      );

      checkins.forEach((checkin) => {
        let tableRow = [];
        tableRow.push({
          value: checkin.cmu_id,
        });
        tableRow.push({
          value: `${checkin.firstname} ${checkin.lastname}`,
        });

        const checkinsArray = checkin.checkinsarray;

        codeArray.forEach((CA) => {
          const checkinsArrayFiltered = checkinsArray.find(
            (el) => el.code === CA.code
          );

          if (checkinsArrayFiltered) {
            tableRow.push({
              value: checkinsArrayFiltered.timerecord.toLocaleString(),
            });
          } else {
            tableRow.push({
              value: null,
            });
          }
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
  console.log({ tableHeader, tableBody });
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
      ) : (
        <></>
      )}
    </div>
  );
}

export default ClassAttend;
