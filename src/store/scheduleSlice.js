import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  institute: null,
  teachers: [],
  subjects: [],
  sections: [],
  constraints: {},
  schedule: {},
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setInstitute(state, action) {
      state.institute = action.payload;
    },
    setTeachers(state, action) {
      state.teachers = action.payload;
    },
    setSubjects(state, action) {
      state.subjects = action.payload;
    },
    setSections(state, action) {
      state.sections = action.payload;
    },
    setConstraints(state, action) {
      state.constraints = action.payload;
    },
    setSchedule(state, action) {
      state.schedule = action.payload;
    },
    resetSchedule(state) {
      state.schedule = {};
    },
  },
});

export const {
  setInstitute,
  setTeachers,
  setSubjects,
  setSections,
  setConstraints,
  setSchedule,
  resetSchedule,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
