import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { TECHNOLOGIES_API } from '../api';

// Async thunk to fetch technologies
export const fetchTechnologies = createAsyncThunk(
    'technologies/fetchTechnologies',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(TECHNOLOGIES_API);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to add a technology
export const addTechnology = createAsyncThunk(
    'technologies/addTechnology',
    async (technologyData, { rejectWithValue }) => {
        try {
            const response = await axios.post(TECHNOLOGIES_API, technologyData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to update a technology
export const updateTechnology = createAsyncThunk(
    'technologies/updateTechnology',
    async ({ id, updates }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${TECHNOLOGIES_API}/technologyID=${id}`, updates);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to delete a technology
export const deleteTechnology = createAsyncThunk(
    'technologies/deleteTechnology',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${TECHNOLOGIES_API}/technologyID=${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const technologiesSlice = createSlice({
    name: 'technologies',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchTechnologies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTechnologies.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTechnologies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add
            .addCase(addTechnology.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTechnology.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addTechnology.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateTechnology.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTechnology.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateTechnology.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteTechnology.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTechnology.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(t => t.id !== action.payload);
            })
            .addCase(deleteTechnology.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default technologiesSlice.reducer;