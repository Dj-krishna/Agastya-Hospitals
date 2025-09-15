import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "./slices/doctorsSlice";
import blogReducer from "./slices/blogSlice";
import healthPackagesReducer from "./slices/healthPackages";
import specialtyReducer from "./slices/specialtySlice";

const store = configureStore({
  reducer: {
    doctors: doctorReducer,
    blogs: blogReducer,
    healthPackages: healthPackagesReducer,
    specialties: specialtyReducer,
  },
});

export default store;
