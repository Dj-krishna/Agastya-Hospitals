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
  const blogs = [
    {
      id: 1,
      title: "Advanced Technology in Healthcare",
      date: "20 March 2024",
      category: "Technology",
      image: "🔬",
      excerpt:
        "Exploring the latest advancements in medical technology and their impact on patient care and treatment outcomes.",
    },
    {
      id: 2,
      title: "How to Control High Blood Pressure and Stay Heart-Healthy",
      date: "18 March 2024",
      category: "Cardiology",
      image: "❤️",
      excerpt:
        "Essential tips and lifestyle changes to manage blood pressure and maintain cardiovascular health.",
    },
    {
      id: 3,
      title: "What is Sports Injuries Rehabilitation?",
      date: "15 March 2024",
      category: "Orthopedics",
      image: "🏃‍♂️",
      excerpt:
        "Understanding the rehabilitation process for sports-related injuries and recovery strategies.",
    },
    {
      id: 4,
      title: "Preventive Healthcare: Your Guide to Staying Healthy",
      date: "12 March 2024",
      category: "Wellness",
      image: "🛡️",
      excerpt:
        "Comprehensive guide to preventive healthcare measures and regular health check-ups.",
    },
    {
      id: 5,
      title: "Understanding Diabetes Management",
      date: "10 March 2024",
      category: "Endocrinology",
      image: "🩸",
      excerpt:
        "Complete guide to managing diabetes through diet, exercise, and medication.",
    },
    {
      id: 6,
      title: "Mental Health Awareness in Modern Times",
      date: "8 March 2024",
      category: "Psychiatry",
      image: "🧠",
      excerpt:
        "Importance of mental health awareness and available treatment options.",
    },
  ];

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
