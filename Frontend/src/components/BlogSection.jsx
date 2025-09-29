import { useState } from "react";
import BlogCards from "./pages/BlogCards";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "../slices/breadcrumbSlice";

const BlogSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="row">
          <div className="col-lg-12 text-center mb-12">
            <h2 className="main-title-center">Health Insights</h2>
          </div>
        </div>

        <BlogCards />
        <div className="text-center mt-12">
          <button
            className="btn-primary rounded-5"
            onClick={() => {
              dispatch(setBreadcrumb(["Home", "Blogs"]));
              window.scrollTo(0, 0);
              navigate("/blog");
            }}
          >
            View All Blogs
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
