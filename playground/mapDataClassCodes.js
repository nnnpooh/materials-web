const a = [
  {
    classcode: '259103-2564-1-001',
    jsondata: {
      '29a3': '2021-07-09T14:21:12',
      facc: '2021-07-06T14:00:00',
    },
    classid: '259103',
    yearstr: '2564',
    semester: '1',
    section: '001',
    graded: true,
    auth_id: '86c87efd-25bc-4e4e-ba29-eaf5ca5391b3',
  },
  {
    classcode: '259103-2564-1-006',
    jsondata: {
      '16b6': '2021-07-08T14:00:00',
    },
    classid: '259103',
    yearstr: '2564',
    semester: '1',
    section: '006',
    graded: true,
    auth_id: '86c87efd-25bc-4e4e-ba29-eaf5ca5391b3',
  },
  {
    classcode: '259103-2564-1-802',
    jsondata: {
      1183: '2021-07-07T16:00:00',
    },
    classid: '259103',
    yearstr: '2564',
    semester: '1',
    section: '802',
    graded: true,
    auth_id: '86c87efd-25bc-4e4e-ba29-eaf5ca5391b3',
  },
];

const b = a.map((el) => {
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

console.log(b[0]);
