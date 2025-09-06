import { useState } from "react";
import axios from "axios";
const BlogSection = () => {
  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get();
    } catch (error) {}
  };
  const blogs = [
    {
      id: 1,
      title: "Advanced Technology",
      date: "20 March 2024",
      image: "🔬",
      excerpt:
        "Exploring the latest advancements in medical technology and their impact on patient care.",
      logo: "🏥",
    },
    {
      id: 2,
      title: "How to Control High Blood Pressure and Stay Heart-Healthy",
      date: "18 March 2024",
      image: "❤️",
      excerpt:
        "Essential tips and lifestyle changes to manage blood pressure and maintain cardiovascular health.",
      logo: "🏥",
    },
    {
      id: 3,
      title: "What is Sports Injuries Rehabilitation?",
      date: "15 March 2024",
      image: "🏃‍♂️",
      excerpt:
        "Understanding the rehabilitation process for sports-related injuries and recovery strategies.",
      logo: "🏥",
    },
    {
      id: 4,
      title: "Preventive Healthcare: Your Guide to Staying Healthy",
      date: "12 March 2024",
      image: "🛡️",
      excerpt:
        "Comprehensive guide to preventive healthcare measures and regular health check-ups.",
      logo: "🏥",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="row">
          <div className="col-lg-12 text-center mb-12">
            <h2 className="main-title-center">Health Insights</h2>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card medical-news">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-6xl">{blog.image}</span>
              </div>
              <div className="blog-meta">
                <span>{blog.category}</span>
                <span>{blog.date}</span>
              </div>
              <h3>
                <a href="#">{blog.title}</a>
              </h3>
              <p className="excerpt"> {blog.excerpt}</p>
              <a href="#">Read the article →</a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-primary">View All Blogs</button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
