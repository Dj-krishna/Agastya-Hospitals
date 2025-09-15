import { useEffect } from "react";
import { useState } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../slices/blogSlice";
import BlogCards from "../components/pages/BlogCards";

const Blog = () => {
  // const [blogsData, setBlogsData] = useState([]);

  const dispatch = useDispatch();
  const {
    data: blogs,
    loading,
    error,
  } = useSelector((state) => {
    console.log(state);
    return state.blogs.blogs;
  });

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  console.log("BLOGS DATA ", blogs);

  return (
    <div className="container p-5">
      {loading ? (
        <div className="text-center">
          <div
            className="spinner-grow text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-center">Loading...</p>
        </div>
      ) : (
        <BlogCards />
      )}
    </div>
  );
};

export default Blog;
