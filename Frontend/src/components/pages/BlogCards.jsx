import { useEffect } from "react";
import { useState } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../slices/blogSlice";

const BlogCards = () => {
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
    <div className="row">
      <div className="col-lg-12">
        <div className="blog-list">
          {blogs?.map((blog) => (
            <div
              key={blog.blogID}
              className="blog-card medical-news shadow-sm border"
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-3">
                <span className="text-6xl">
                  <img src={blog.postThumbnail} />
                </span>
              </div>
              <div className="blog-meta">
                <span>{blog.category}</span>
                <span>{format(new Date(blog.dateOfPost), "dd-MMM-yyyy")}</span>
              </div>
              <h3 className="mb-5">
                <a href="#">{blog.title}</a>
              </h3>
              {/* <p className="excerpt"> {blog.excerpt}</p> */}
              <a href="#" className="text-primary f-12">
                Read the article →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCards;
