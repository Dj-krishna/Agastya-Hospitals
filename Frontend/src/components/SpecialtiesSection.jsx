import { useRef } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpecialties } from "../slices/specialtySlice";
import { useNavigate } from "react-router-dom";
import { setBreadcrumb } from "../slices/breadcrumbSlice";

const SpecialtiesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCard, setActiveCard] = useState("");
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const dispatch = useDispatch();
  // const { specialties, loading: isLoading } = useSelector(
  //   (state) => state.specialties
  // );

  // useEffect(() => {
  //   dispatch(fetchSpecialties());
  // }, [dispatch]);

  const specialties = [
    {
      id: 1,
      name: "General Medicine",
      description: "Comprehensive medical care for all ages",
      icon: "🏥",
      active: false,
    },
    {
      id: 2,
      name: "Interventional Pulmonology",
      description: "Advanced respiratory care and procedures",
      icon: "🫁",
      active: true,
    },
    {
      id: 3,
      name: "Nephrology & Urology",
      description: "Kidney and urinary system specialists",
      icon: "🫘",
      active: false,
    },
    {
      id: 4,
      name: "Cardiology",
      description: "Heart and cardiovascular health",
      icon: "❤️",
      active: false,
    },
    {
      id: 5,
      name: "Neurology",
      description: "Brain and nervous system care",
      icon: "🧠",
      active: false,
    },
    {
      id: 6,
      name: "Orthopedics",
      description: "Bone and joint specialists",
      icon: "🦴",
      active: false,
    },
  ];

  const handleDotClick = (index) => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth; // visible width
      scrollRef.current.scrollTo({
        left: containerWidth * index,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  const totalDots = Math.ceil(specialties.length / 2);

  return (
    <section className="container specialties-bg mx-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            {/* <span className="text-2xl mr-2">→</span> */}
            <h2 className="main-title">Our Specialties</h2>
          </div>
          <a
            onClick={() => {
              window.scrollTo(0, 0);
              dispatch(setBreadcrumb(["Home", "Specialties"]));
              navigate("/specialties");
            }}
            className="text-primary f-w-600 f-18 cursor-pointer"
          >
            View All Specialties
          </a>
        </div>

        <div
          className="flex gap-6 overflow-x-auto pb-4 specialties-bg-scroller"
          ref={scrollRef}
        >
          {specialties.map((specialty) => (
            <div
              key={specialty.id}
              className={`flex-shrink-0 specialty-card-home ${
                specialty.active
                  ? "bg-white text-gray-700 border-gray-200 hover:border-hospital-blue"
                  : "bg-white text-gray-700 border-gray-200 hover:border-hospital-blue"
              }`}
            >
              {/* specialty-card-home-active text-white border-hospital-blue / text-blue-100*/}
              <div className="text-4xl mb-4">{specialty.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{specialty.name}</h3>
              <p
                className={`text-sm ${
                  specialty.active ? "text-gray-600" : "text-gray-600"
                }`}
              >
                {specialty.description}
              </p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        {/* <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-hospital-blue rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div> */}
        {/* Scroll indicator dots */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {Array.from({ length: totalDots }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full ${
                  index === activeIndex ? "bg-hospital-blue" : "bg-gray-300"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
