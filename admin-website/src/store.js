import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import doctorReducer from "./slices/doctorsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
  },
});

export default store;
