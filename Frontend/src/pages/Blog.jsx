const Blog = () => {
  const blogs = [
    {
      id: 1,
      title: "Advanced Technology in Healthcare",
      date: "20 March 2024",
      category: "Technology",
      image: "🔬",
      excerpt: "Exploring the latest advancements in medical technology and their impact on patient care and treatment outcomes."
    },
    {
      id: 2,
      title: "How to Control High Blood Pressure and Stay Heart-Healthy",
      date: "18 March 2024",
      category: "Cardiology",
      image: "❤️",
      excerpt: "Essential tips and lifestyle changes to manage blood pressure and maintain cardiovascular health."
    },
    {
      id: 3,
      title: "What is Sports Injuries Rehabilitation?",
      date: "15 March 2024",
      category: "Orthopedics",
      image: "🏃‍♂️",
      excerpt: "Understanding the rehabilitation process for sports-related injuries and recovery strategies."
    },
    {
      id: 4,
      title: "Preventive Healthcare: Your Guide to Staying Healthy",
      date: "12 March 2024",
      category: "Wellness",
      image: "🛡️",
      excerpt: "Comprehensive guide to preventive healthcare measures and regular health check-ups."
    },
    {
      id: 5,
      title: "Understanding Diabetes Management",
      date: "10 March 2024",
      category: "Endocrinology",
      image: "🩸",
      excerpt: "Complete guide to managing diabetes through diet, exercise, and medication."
    },
    {
      id: 6,
      title: "Mental Health Awareness in Modern Times",
      date: "8 March 2024",
      category: "Psychiatry",
      image: "🧠",
      excerpt: "Importance of mental health awareness and available treatment options."
    }
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Health Blog
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Blog Image */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-6xl">{blog.image}</span>
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-hospital-blue font-medium">
                    {blog.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {blog.date}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {blog.excerpt}
                </p>
                
                <button className="text-hospital-blue hover:text-hospital-dark-blue font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog 