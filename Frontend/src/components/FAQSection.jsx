import { useState } from 'react'

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0)

  const faqs = [
    {
      id: 0,
      question: "Why is Agastya Hospitals known as the best hospital in Hyderabad?",
      answer: "Agastya Hospitals is recognized as the best hospital in Hyderabad due to our state-of-the-art facilities, highly qualified medical professionals, advanced technology, and commitment to patient-centered care. We have consistently delivered excellent healthcare outcomes and maintain the highest standards of medical excellence."
    },
    {
      id: 1,
      question: "When should you go to the hospital?",
      answer: "You should visit the hospital immediately if you experience severe chest pain, difficulty breathing, sudden severe headache, loss of consciousness, severe bleeding, or any other life-threatening symptoms. For non-emergency conditions, consult your doctor for guidance."
    },
    {
      id: 2,
      question: "What specialties does Agastya Hospitals offer?",
      answer: "We offer comprehensive medical specialties including Cardiology, Neurology, Orthopedics, General Surgery, ENT, Pulmonology, Nephrology, Urology, and many more. Our team of specialists provides expert care across all major medical disciplines."
    },
    {
      id: 3,
      question: "How can I book an appointment?",
      answer: "You can book an appointment by calling our 24x7 helpline at +91 9492 88 1134, visiting our website, or using our patient portal. We also offer online appointment booking for your convenience."
    },
    {
      id: 4,
      question: "What insurance plans do you accept?",
      answer: "We accept most major insurance plans and have tie-ups with leading insurance providers. Please contact our billing department to verify your specific insurance coverage and benefits."
    }
  ]

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? -1 : id)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          FAQs
        </h2>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <span className={`text-2xl transition-transform duration-200 ${
                  openFAQ === faq.id ? 'rotate-45' : ''
                }`}>
                  +
                </span>
              </button>
              
              {openFAQ === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <button className="btn-primary">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  )
}

export default FAQSection 