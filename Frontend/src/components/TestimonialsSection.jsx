import { useEffect, useState } from "react";
import { useRef } from "react";
import { TESTIMONIALS_API } from "../api/services";
import axios from "axios";
import { Card, Col, Container, Modal, ModalBody, Row } from "reactstrap";

const TestimonialsSection = () => {
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const scrollRef = useRef(null);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(TESTIMONIALS_API);
      setTestimonialsData(response.data.data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const testimonials = [
    {
      _id: "69109163b7b1d360a1a37863",
      testimonialID: 10,
      name: "TEST 123",
      place: "Hyderabd",
      userPhoto:
        "https://ik.imagekit.io/sandy143/testimonials/userPhoto/1762693473588-bg_NnmZ064Rj.jpg",
      type: "text",
      description: "Very good service from this hospital",
      videoUpload: null,
      youtubeLink: "",
      createdBy: "user",
      createdAt: "2025-11-09T13:04:35.009Z",
      updatedAt: "2025-11-09T13:04:35.009Z",
    },
    {
      _id: "691090dab7b1d360a1a37860",
      testimonialID: 9,
      name: "TEST",
      place: "Hyderabd",
      userPhoto:
        "https://ik.imagekit.io/sandy143/testimonials/userPhoto/1762693337432-bg_z8JBvR9z8.jpg",
      type: "text",
      description: "Very good service from this hospital",
      videoUpload: null,
      youtubeLink: "",
      createdBy: "user",
      createdAt: "2025-11-09T13:02:18.867Z",
      updatedAt: "2025-11-09T13:02:18.867Z",
    },
    {
      _id: "69109034b7b1d360a1a3785c",
      testimonialID: 8,
      name: "TEST",
      place: "Hyderabd",
      userPhoto:
        "https://ik.imagekit.io/sandy143/testimonials/userPhoto/1762693170442-bg_j2aRdIr0l.jpg",
      type: "text",
      description: "Very good service",
      videoUpload: null,
      youtubeLink: "",
      createdBy: "user",
      createdAt: "2025-11-09T12:59:32.269Z",
      updatedAt: "2025-11-09T12:59:32.269Z",
    },
    {
      _id: "69109033b7b1d360a1a37859",
      testimonialID: 7,
      name: "TEST",
      place: "Hyderabd",
      userPhoto:
        "https://ik.imagekit.io/sandy143/testimonials/userPhoto/1762693170160-bg_FSOgD1RlW.jpg",
      type: "text",
      description: "Very good service",
      videoUpload: null,
      youtubeLink: "",
      createdBy: "user",
      createdAt: "2025-11-09T12:59:31.582Z",
      updatedAt: "2025-11-09T12:59:31.582Z",
    },
    {
      _id: "69109033b7b1d360a1a37856",
      testimonialID: 6,
      name: "TEST",
      place: "Hyderabd",
      userPhoto:
        "https://ik.imagekit.io/sandy143/testimonials/userPhoto/1762693169917-bg_1Y1ACMtX1.jpg",
      type: "text",
      description: "Very good service",
      videoUpload: null,
      youtubeLink: "",
      createdBy: "user",
      createdAt: "2025-11-09T12:59:31.448Z",
      updatedAt: "2025-11-09T12:59:31.448Z",
    },
    {
      _id: "69109033b7b1d360a1a37853",
      testimonialID: 5,
      name: "TEST",
      place: "Hyderabd",
      userPhoto:
        "https://ik.imagekit.io/sandy143/testimonials/userPhoto/1762693169706-bg_4qedY8xZd.jpg",
      type: "text",
      description: "Very good service",
      videoUpload: null,
      youtubeLink: "",
      createdBy: "user",
      createdAt: "2025-11-09T12:59:31.234Z",
      updatedAt: "2025-11-09T12:59:31.234Z",
    },
    {
      _id: "690dc56cabd2dbb045610b82",
      testimonialID: 4,
      name: "Captain America",
      place: "Vijayawada",
      userPhoto: null,
      type: "video",
      description: "Goodexperience with this hospital.",
      videoUpload: null,
      youtubeLink: "https://youtu.be/xuP4g7IDgDM?si=2SCccOiVUrLhhbGu",
      createdBy: "user",
      createdAt: "2025-11-07T10:09:48.719Z",
      updatedAt: "2025-11-07T10:09:48.719Z",
    },
    {
      _id: "6904a5e979f4102b5ac9067a",
      testimonialID: 2,
      name: "TEST VIDEO",
      place: "Hyderabd",
      userPhoto:
        "blob:http://localhost:3000/a23f09f1-28ac-4614-9f02-b6de98057236",
      type: "video",
      description: "",
      videoUpload:
        "https://ik.imagekit.io/sandy143/testimonials/videoUpload/1761912296166-Stunning_Sunset_Seen_From_The_Sea___Time_lapse___10_Seconds_Video___Nature_Blogs_K8XES03nd.mp4",
      youtubeLink: "",
      createdBy: "user",
      createdAt: "2025-10-31T12:04:57.627Z",
      updatedAt: "2025-11-11T13:30:35.949Z",
    },
  ];

  const handleDotClick = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300; // adjust for card width
      if (direction === "left") {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-16">
      <div className="container-fluid mx-auto px-4">
        <div className="container mb-3">
          <h2 className="main-title-alt">
            Proven Care. Trusted Results. Thousands have chosen
            <span>our center and experienced life-changing care.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
            onClick={() => handleDotClick("left")}
          >
            <span className="text-2xl">←</span>
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
            onClick={() => handleDotClick("right")}
          >
            <span className="text-2xl">→</span>
          </button>

          {/* Testimonials Carousel */}
          <div className="flex gap-6 overflow-x-auto pb-4" ref={scrollRef}>
            {testimonialsData?.map((testimonial) => (
              <div
                key={testimonial._id}
                className="testimonial-card col-md-4 border-1"
              >
                <div className="text-6xl text-gray-200 mb-4">"</div>
                <p>
                  {testimonial.description ? testimonial.description : "NA"}
                </p>
                <span className="date">{testimonial.updatedAt}</span>
                <div className="testimonial-footer">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                      {testimonial.userPhoto && (
                        <span>
                          <img src={testimonial.userPhoto} />
                        </span>
                      )}
                      <span className="text-gray-600 font-semibold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.place}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    {testimonial.type === "video" &&
                      testimonial.videoUpload && (
                        <button
                          className="video-btn"
                          onClick={() => {
                            setCurrentVideo(testimonial.videoUpload);
                            setVideoModalOpen(true);
                          }}
                        >
                          Watch Video
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={videoModalOpen}
        toggle={() => setVideoModalOpen(false)}
        centered
        size="lg"
      >
        <ModalBody className="text-center">
          {currentVideo && (
            <video
              src={currentVideo}
              width="100%"
              height="auto"
              controls
              autoPlay
              style={{ maxHeight: "70vh", borderRadius: "10px" }}
            />
          )}
        </ModalBody>
      </Modal>
    </section>
  );
};

export default TestimonialsSection;
