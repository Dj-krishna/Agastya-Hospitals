// src/store/breadcrumbSlice.js
import { createSlice } from "@reduxjs/toolkit";

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState: {
    trail: ["Home"], // store breadcrumb path
  },
  reducers: {
    setBreadcrumb: (state, action) => {
      state.trail = action.payload; // action.payload should be an array of breadcrumb parts
    },
  },
});

export const { setBreadcrumb } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;
