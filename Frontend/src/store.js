import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "./slices/doctorsSlice";

const store = configureStore({
  reducer: {
    doctors: doctorReducer,
  },
});

export default store;
