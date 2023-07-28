import API from '../../environment/Api';

// Get All Students by teacherId from API
export const loadSudentsApi = async teacherId =>
  await API.get(`getactivemaasterstudentsbyuserid/${teacherId}`);

// Create Student
export const createStudentApi = async studentdata =>
  await API.post(`savemasterstudent`, studentdata);

//Get Student Attendance report
export const getAttendanceReportApi = async data =>
  await API.get(
    `getlast7attendancedates/${data.userid}/${data.attendancedate}`,
  );

//Get Student AttendanceList by teacherId and selected date
export const getAttendanceListApi = async data =>
  await API.get(
    `getattendanceofteacherbydate/${data.userid}/${data.attendancedate}`,
  );

//Delete Student API
export const deleteStudentApi = async data =>
  await API.get(`deletemasterstudent/${data.userid}/${data.studentid}`);
// export const deleteStudentApi = async data =>
// await API.get(`deletemasterstudent/${data.userid}/${data.studentid}`);
// console.log("dataaaaaaaaaaaaaa------->",data.studentId);

//Update Student API
export const updateStudentApi = async data =>
  await API.put(
    `updatemasterstudent/${data.studentId}`,
    data.studentUpdateDetails,
  );

// post Student AttendanceList by teacherId and selected date
export const postAttendanceListApi = async data =>
  await API.post(`saveattendance`, data);

// get Students List for Attendance
export const getStudentListforAttendanceApi = async data =>
  await API.get(
    `getactivemaasterstudentsbyuseridbycategory/${data.userid}/${data.studentcategory}`,
  );
