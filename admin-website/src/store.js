import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import doctorReducer from "./slices/doctorsSlice";
import patientReducer from "./slices/patientSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    patients: patientReducer,
  },
});

export default store;
