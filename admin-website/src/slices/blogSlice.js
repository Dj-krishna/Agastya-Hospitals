import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  BLOGS_API,
  CREATE_BLOGS_API,
  DELETE_BLOGS_API,
  UPDATE_BLOGS_API,
} from "../api";

// Async thunks
export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const response = await axios.get(BLOGS_API);
  return response.data;
});

export const addBlog = createAsyncThunk("blogs/addBlog", async (blogData) => {
  const response = await axios.post(CREATE_BLOGS_API, blogData);
  return response.data;
});

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blogData }) => {
    const response = await axios.put(`${UPDATE_BLOGS_API}/${id}`, blogData);
    return response.data;
  }
);

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  const response = await axios.delete(`${DELETE_BLOGS_API}?blogID=${id}`);
  return response.message;
});

// Slice
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(
          (blog) => blog.id === action.payload.id
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(
          (blog) => blog.blogID !== action.payload
        );
      });
  },
});

export default blogSlice.reducer;
