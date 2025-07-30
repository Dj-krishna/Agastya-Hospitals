const TechnologySection = () => {
  const technologies = [
    {
      id: 1,
      name: "Siemens ARTIS one",
      icon: "🔬",
      description: "Advanced imaging system"
    },
    {
      id: 2,
      name: "Leica M520 Optics",
      icon: "🔍",
      description: "Precision surgical microscope"
    },
    {
      id: 3,
      name: "J&J VELYS Robotic-Assisted Solution",
      icon: "🤖",
      description: "Robotic surgical assistance"
    },
    {
      id: 4,
      name: "Philips IntelliBridge Enterprise",
      icon: "💻",
      description: "Healthcare information system"
    },
    {
      id: 5,
      name: "GE Healthcare Discovery",
      icon: "📡",
      description: "Advanced diagnostic imaging"
    },
    {
      id: 6,
      name: "Stryker Navigation System",
      icon: "🧭",
      description: "Surgical navigation technology"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Healthcare Through Advanced Technologies
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{tech.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{tech.name}</h3>
              <p className="text-xs text-gray-600">{tech.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-lg">
            State-of-the-Art Equipment • Technological Excellence • Precision-Driven Tools
          </p>
        </div>
      </div>
    </section>
  )
}

export default TechnologySection 