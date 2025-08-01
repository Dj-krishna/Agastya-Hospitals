import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import userDetails from "./userDetails.json";
import {
    loginUser
} from "../api/Services";

// Async thunk for login
export const loginAsync = createAsyncThunk(
    'auth/loginAsync',
    async (credentials, {
        rejectWithValue
    }) => {
        try {
            const response = await loginUser(credentials);
            return response;
        } catch (error) {
            const errorMessage = error.response && error.response.data ? error.response.data : 'Login failed';
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    isAuthenticated: false,
    loading: false,
    error: null,
    userDetails: userDetails,
    token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userDetails');
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.error = null;
                state.userDetails = action.payload.user || userDetails;
                state.token = action.payload.token || action.payload.accessToken;

                // Store token and user details in localStorage
                localStorage.setItem('token', state.token);
                localStorage.setItem('userDetails', JSON.stringify(state.userDetails));
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload || 'Login failed';
            });
    },
});

export const {
    logout,
    setError,
    setLoading,
    clearError
} = authSlice.actions;
export default authSlice.reducer;