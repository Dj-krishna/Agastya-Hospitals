import {
    createSlice
} from "@reduxjs/toolkit";
import userDetails from "./userDetails.json";

const initialState = {
    isAuthenticated: false,
    loading: false,
    error: null,
    userDetails: userDetails,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            const {
                userName,
                password
            } = action.payload;

            state.userDetails = {
                userName,
                password,
            };
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    login,
    logout,
    setError,
    setLoading
} = authSlice.actions;
export default authSlice.reducer;