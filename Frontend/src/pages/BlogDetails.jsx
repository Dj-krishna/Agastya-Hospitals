import axios from "axios";
import { format } from "date-fns";
import React from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBlogs } from "../slices/blogSlice";

const BlogDetails = () => {
  // const [blogs, setBlogs] = useState([]);
  const location = useLocation();
  const blogData = location.state?.blogData;

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

  // const fetchBlogData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${BLOGS_API}?blogID=${blogData.blogID}`
  //     );
  //     if (response.data) {
  //       setBlogs(response.data);
  //     }
  //   } catch {
  //     console.log("No blog data");
  //   }
  // };

  // useEffect(() => {
  //   fetchBlogData();
  // }, []);
  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.dateOfPost) - new Date(a.dateOfPost)
  );
  return (
    <div className="container py-5">
      <div className="row m-0">
        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
          <h2 className="f-30 f-w-700">{blogData.title}</h2>
          <div className="mt-4">
            <img
              className="rounded-5"
              src={blogData.postBanner}
              style={{ height: "200px", width: "100%" }}
            />
          </div>
          <p className="f-16 text-muted mt-4 " style={{ color: "#999999" }}>
            by Admin | {format(new Date(blogData.dateOfPost), "MMM dd, yyyy")}
          </p>
          <div className="mt-3">
            <p className="f-14">{blogData.blogContent}</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div className="rounded-5 bg-light p-4 mx-2">
            <h2 className="f-30 f-w-700 mb-3">Recent Posts</h2>
            <ul>
              {sortedBlogs.slice(0, 5).map((data) => (
                <li key={data.blogID} className="mb-4 inline-flex">
                  <span>
                    <svg
                      width="10"
                      height="13"
                      viewBox="0 0 10 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.07997 9.10217L1.11029 16.0718C0.969643 16.2125 0.890625 16.4033 0.890625 16.6022C0.890625 16.8011 0.969643 16.9919 1.11029 17.1325C1.25095 17.2732 1.44171 17.3522 1.64062 17.3522C1.83954 17.3522 2.0303 17.2732 2.17096 17.1325L9.67095 9.6325C9.96385 9.33961 9.96385 8.86474 9.67095 8.57184L2.17096 1.07184C2.0303 0.93119 1.83954 0.852173 1.64062 0.852173C1.44171 0.852173 1.25095 0.93119 1.11029 1.07184C0.969643 1.2125 0.890625 1.40326 0.890625 1.60217C0.890625 1.80109 0.969643 1.99185 1.11029 2.1325L8.07997 9.10217Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                  </span>
                  &nbsp;
                  <span className="f-14">{data.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-5 bg-light p-4 mx-2 mt-5">
            <h2 className="f-30 f-w-700 mb-3">Tags</h2>
            <p>
              {blogData.tags.map((tag, index) => (
                <span key={index}>
                  {tag}
                  {blogData.tags.length === index + 1 ? " " : ", "}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
