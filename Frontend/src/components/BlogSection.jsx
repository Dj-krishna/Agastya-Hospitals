const BlogSection = () => {
  const blogs = [
    {
      id: 1,
      title: "Advanced Technology",
      date: "20 March 2024",
      image: "🔬",
      excerpt: "Exploring the latest advancements in medical technology and their impact on patient care.",
      logo: "🏥"
    },
    {
      id: 2,
      title: "How to Control High Blood Pressure and Stay Heart-Healthy",
      date: "18 March 2024",
      image: "❤️",
      excerpt: "Essential tips and lifestyle changes to manage blood pressure and maintain cardiovascular health.",
      logo: "🏥"
    },
    {
      id: 3,
      title: "What is Sports Injuries Rehabilitation?",
      date: "15 March 2024",
      image: "🏃‍♂️",
      excerpt: "Understanding the rehabilitation process for sports-related injuries and recovery strategies.",
      logo: "🏥"
    },
    {
      id: 4,
      title: "Preventive Healthcare: Your Guide to Staying Healthy",
      date: "12 March 2024",
      image: "🛡️",
      excerpt: "Comprehensive guide to preventive healthcare measures and regular health check-ups.",
      logo: "🏥"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Blogs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Blog Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{blog.logo}</span>
                    <span className="text-sm text-gray-500">Agastya Hospitals</span>
                  </div>
                  <span className="text-sm text-gray-500">{blog.date}</span>
                </div>
              </div>

              {/* Blog Image */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-6xl">{blog.image}</span>
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {blog.excerpt}
                </p>
                <button className="text-hospital-blue hover:text-hospital-dark-blue font-medium text-sm">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-primary">
            View All Blogs
          </button>
        </div>
      </div>
    </section>
  )
}

export default BlogSection 