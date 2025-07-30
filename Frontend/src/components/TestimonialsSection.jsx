const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Mr. Srinivas",
      location: "Hyderabad",
      date: "15 March 2024",
      text: "The care I received at Agastya Hospitals was exceptional. The doctors and staff were professional and caring throughout my treatment.",
      hasVideo: true
    },
    {
      id: 2,
      name: "Mr. Rajesh Iyer",
      location: "Bangalore",
      date: "12 March 2024",
      text: "I'm grateful for the excellent treatment I received. The facilities are world-class and the medical team is highly skilled.",
      hasVideo: false
    },
    {
      id: 3,
      name: "Mrs. Shamira Devi",
      location: "Chennai",
      date: "10 March 2024",
      text: "The hospital exceeded my expectations. The staff was compassionate and the treatment was successful. Highly recommended!",
      hasVideo: true
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Proven Care. Trusted Results.
          </h2>
          <p className="text-xl text-gray-600">
            Thousands have chosen our center and experienced life-changing care.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10">
            <span className="text-2xl">←</span>
          </button>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10">
            <span className="text-2xl">→</span>
          </button>

          {/* Testimonials Carousel */}
          <div className="flex gap-6 overflow-x-auto pb-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-96 bg-white p-8 rounded-lg shadow-lg"
              >
                <div className="text-6xl text-gray-200 mb-4">"</div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">{testimonial.date}</span>
                  {testimonial.hasVideo && (
                    <button className="btn-primary text-sm">
                      Watch Video
                    </button>
                  )}
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection 