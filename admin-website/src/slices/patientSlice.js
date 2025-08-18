import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { PATIENTS_API } from "../api";

export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(PATIENTS_API);
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