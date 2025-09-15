import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "./slices/doctorsSlice";
import blogReducer from "./slices/blogSlice";

const store = configureStore({
  reducer: {
    doctors: doctorReducer,
    blogs: blogReducer,
  },
});

export default store;
