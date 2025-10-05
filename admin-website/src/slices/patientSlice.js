import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { PATIENTS_API } from "../api";
import { getRoleId } from "../utils";

export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async (_, { rejectWithValue }) => {
    try {
      // Get user details and roleid
      let userDetails = {};
      try {
        userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
      } catch (e) {
        userDetails = {};
      }
      const roleid = getRoleId();
      const allowedRoles = [1, 2, 3];
      let url = PATIENTS_API;
      if (!allowedRoles.includes(roleid)) {
        if (userDetails.email) {
          url = `${PATIENTS_API}?email=${encodeURIComponent(userDetails.email)}`;
        } else if (userDetails.mobile) {
          url = `${PATIENTS_API}?mobile=${encodeURIComponent(userDetails.mobile)}`;
        }
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default patientSlice.reducer;