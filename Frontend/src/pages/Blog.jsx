import { useEffect } from "react";
import { useState } from "react";
import { BLOGS_API } from "../api/services";
import axios from "axios";
import { format } from "date-fns";

const Blog = () => {
  const [blogsData, setBlogsData] = useState([]);

  const fetchBlogs = async () => {
    const response = await axios.get(BLOGS_API);
    setBlogsData(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="container p-5">
      <div className="row mx-5">
        <div className="col-lg-12">
          <div className="blog-list">
            {blogsData.data?.map((blog) => (
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
                  <span>
                    {format(new Date(blog.dateOfPost), "dd-MMM-yyyy")}
                  </span>
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
    </div>
  );
};

export default Blog;
