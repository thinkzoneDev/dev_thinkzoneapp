import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  students: [],
  attendance: [],
  studentsforattendance: [],
  attendancedate: [],
  isLoading: false,
  error: null,
};

export const StudentSlice = createSlice({
  name: 'StudentSlice',
  initialState,
  reducers: {
    // Get All Students by teacherId from API
    getStudentStart(state, action) {
      state.isLoading = true;
    },
    getStudentSuccess(state, action) {
      state.isLoading = false;
      state.students = action.payload;
    },
    getStudentError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create Student
    createStudentStart(state, action) {
      state.isLoading = true;
    },
    createStudentSuccess(state, action) {
      state.isLoading = false;
    },
    createStudentError(state, action) {
      state.error = action.payload;
    },

    //Get Student Attendance report
    getAttendanceReportStart(state, action) {
      state.isLoading = true;
    },
    getAttendanceReportSuccess(state, action) {
      state.isLoading = false;
      state.attendancedate = action.payload;
    },
    getAttendanceReportError(state, action) {
      state.isLoading = false;
    },
    //Get Student Attendance list by teacherid and selected date
    getAttendanceListStart(state, action) {
      state.isLoading = true;
    },
    getAttendanceListSuccess(state, action) {
      console.log(action, 'action');
      state.isLoading = false;
      state.attendance = action.payload;
    },
    getAttendanceListError(state, action) {
      state.isLoading = false;
    },

    //Delete Student
    deleteStudentStart(state, action) {
      state.isLoading = true;
    },
    deleteStudentSuccess(state, action) {
      state.isLoading = false;
    },
    deleteStudentError(state, action) {
      state.isLoading = false;
    },

    //Update Student
    updateStudentStart(state, action) {
      state.isLoading = true;
    },
    updateStudentSuccess(state, action) {
      state.isLoading = false;
      state.students = action.payload;
    },
    updateStudentError(state, action) {
      state.isLoading = false;
    },

    //Post Attendance
    postAttendanceStart(state, action) {
      state.isLoading = true;
    },
    postAttendanceSuccess(state, action) {
      state.isLoading = false;
      state.attendance = action.payload;
    },
    postAttendanceError(state, action) {
      state.isLoading = false;
    },

    //Get Student list for Attendance
    getStudentListforAttendanceStart(state, action) {
      state.isLoading = true;
    },
    getStudentListforAttendanceSuccess(state, action) {
      state.isLoading = false;
      state.studentsforattendance = action.payload;
    },
    getStudentListforAttendanceError(state, action) {
      state.isLoading = false;
    },
  },
});

export const {
  getStudentStart,
  getStudentSuccess,
  getStudentError,
  createStudentStart,
  createStudentSuccess,
  createStudentError,
  getAttendanceReportStart,
  getAttendanceReportSuccess,
  getAttendanceReportError,
  getAttendanceListStart,
  getAttendanceListSuccess,
  getAttendanceListError,
  deleteStudentStart,
  deleteStudentSuccess,
  deleteStudentError,
  updateStudentStart,
  updateStudentSuccess,
  updateStudentError,
  postAttendanceStart,
  postAttendanceSuccess,
  postAttendanceError,
  getStudentListforAttendanceStart,
  getStudentListforAttendanceSuccess,
  getStudentListforAttendanceError,
} = StudentSlice.actions;
export default StudentSlice.reducer;
