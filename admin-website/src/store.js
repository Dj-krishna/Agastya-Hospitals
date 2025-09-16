import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import doctorReducer from "./slices/doctorsSlice";
import patientReducer from "./slices/patientSlice";
import blogReducer from "./slices/blogSlice";
import technologiesReducer from "./slices/technologiesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    patients: patientReducer,
    blogs: blogReducer,
    technologies: technologiesReducer,
  },
});

export default store;
