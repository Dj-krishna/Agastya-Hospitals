import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "./slices/doctorsSlice";
import blogReducer from "./slices/blogSlice";
import healthPackagesReducer from "./slices/healthPackages";
import specialtyReducer from "./slices/specialtySlice";
import breadcrumbReducer from "./slices/breadcrumbSlice";

const store = configureStore({
  reducer: {
    doctors: doctorReducer,
    blogs: blogReducer,
    healthPackages: healthPackagesReducer,
    specialties: specialtyReducer,
    breadcrumb: breadcrumbReducer,
  },
});

export default store;
