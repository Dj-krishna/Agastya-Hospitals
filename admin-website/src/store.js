import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import doctorReducer from "./slices/doctorsSlice";
import patientReducer from "./slices/patientSlice";
import blogReducer from "./slices/blogSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    patients: patientReducer,
    blogs: blogReducer,
  },
});

export default store;
