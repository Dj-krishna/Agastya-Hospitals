import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import { Card, Col, Container, Modal, ModalBody, Row } from "reactstrap";
import TestimonialForm from "./TestimonialForm";
import axios from "axios";
import { TESTIMONIALS_API } from "../../api";
import { toasterConfig } from "../../utils";
import { format } from "date-fns";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import CardSkeleton from "../Common/Component/CardSkeleton";

const Testimonials = () => {
  const [showTestiForm, setShowTestiForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testimonialID, setTestimonialID] = useState(null);
  const [testimonialToEdit, setTestimonialToEdit] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const fetchTestimonials = async () => {
    await axios
      .get(TESTIMONIALS_API)
      .then((res) => {
        setIsLoading(false);
        setTestimonialsData(res.data.data);
      })
      .catch((error) => {
        setIsLoading(true);
        toasterConfig("error", "Error fetching testimonials data");
        console.error("Error fetching testimonials:", error);
      });
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const getShortDescription = (desc, maxLines = 2) => {
    if (!desc) return "";
    const lines = desc.split(/\r?\n/);
    if (lines.length <= maxLines) return desc;
    return (
      lines.slice(0, maxLines).join("\n") +
      " ... " +
      "<span class='read-more'>Read more</span>"
    );
  };

  const editTestimonial = (item) => {
    setIsEditMode(true);
    setTestimonialID(item.testimonialID);
    setShowTestiForm(true);
    setTestimonialToEdit(item);
  };

  const deleteTestimonial = async (item) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You want to delete this testimonial? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await axios.delete(`${TESTIMONIALS_API}?testimonialID=${item.testimonialID}`);
        toasterConfig("success", "Testimonial deleted successfully!");
        fetchTestimonials(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting Testimonial:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete Testimonial. Please try again.";
      toasterConfig("error", errorMessage);
    }
  };

  if (isLoading) {
    return <CardSkeleton count={8} />;
  }

  return (
    <>
      {!showTestiForm && (
        <Breadcrumbs
          mainTitle={showTestiForm ? "Add Testimonials" : "Testimonials"}
          buttonTitle={showTestiForm ? "Cancel" : "Add Testimonial"}
          onClick={() => {
            setShowTestiForm(showTestiForm ? false : true);
            setIsEditMode(false);
            setTestimonialID(null);
          }}
          btnColor={showTestiForm ? "danger" : "primary"}
        />
      )}

      {!showTestiForm ? (
        <Container fluid={true}>
          <Row>
            {testimonialsData?.length > 0 ? (
              testimonialsData?.map((testimonial) => (
                <Col
                  lg="6"
                  md="6"
                  sm="12"
                  xs="12"
                  key={testimonial.testimonialID}
                >
                  <Card className="p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 40 40"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.2">
                            <mask
                              id="mask0_199_608"
                              style={{ maskType: "luminance" }}
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="40"
                              height="40"
                            >
                              <path
                                d="M39.5 0.5V39.5H0.5V0.5H39.5Z"
                                fill="white"
                                stroke="white"
                              />
                            </mask>
                            <g mask="url(#mask0_199_608)">
                              <path
                                d="M15.3346 17.6667H6.0013C5.38246 17.6667 4.78897 17.4208 4.35139 16.9832C3.9138 16.5457 3.66797 15.9522 3.66797 15.3333V8.33333C3.66797 7.71449 3.9138 7.121 4.35139 6.68342C4.78897 6.24583 5.38246 6 6.0013 6H13.0013C13.6201 6 14.2136 6.24583 14.6512 6.68342C15.0888 7.121 15.3346 7.71449 15.3346 8.33333V22.3333C15.3346 28.5563 12.2243 32.4437 6.0013 34"
                                stroke="#1A365A"
                                stroke-width="6"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M36.3346 17.6667H27.0013C26.3825 17.6667 25.789 17.4208 25.3514 16.9832C24.9138 16.5457 24.668 15.9522 24.668 15.3333V8.33333C24.668 7.71449 24.9138 7.121 25.3514 6.68342C25.789 6.24583 26.3825 6 27.0013 6H34.0013C34.6201 6 35.2136 6.24583 35.6512 6.68342C36.0888 7.121 36.3346 7.71449 36.3346 8.33333V22.3333C36.3346 28.5563 33.2243 32.4437 27.0013 34"
                                stroke="#1A365A"
                                stroke-width="6"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div>
                        <FaPencilAlt
                          color="#7366ff"
                          onClick={() => editTestimonial(testimonial)}
                          className="me-2 text-primary cursor-pointer"
                          title="Edit Testimonial"
                        />
                        &nbsp;&nbsp;
                        <span className="text-muted">|</span>
                        &nbsp;&nbsp;
                        <FaTrashAlt
                          onClick={() => deleteTestimonial(testimonial)}
                          className="text-danger cursor-pointer"
                          title="Delete Speciality"
                        />
                      </div>
                    </div>
                    <div className="m-t-10">
                      <p>
                        {getShortDescription(
                          testimonial.description
                            ? testimonial.description
                            : "NA"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="f-12 f-w-300">
                        {format(new Date(testimonial.updatedAt), "dd MMM yyyy")}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="d-flex align-items-center">
                        {testimonial.userPhoto ? (
                          <img
                            width={"40"}
                            height={"40"}
                            src={testimonial.userPhoto}
                            alt="user photo"
                            className="rounded-5 border-1"
                            style={{
                              width: "40px",
                              height: "40px",
                              border: "1px solid #ccc",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-5 border-1"
                            style={{
                              width: "40px",
                              height: "40px",
                              border: "1px solid #ccc",
                              background: "#f0f0f0",
                            }}
                          ></div>
                        )}
                        <ul className="p-l-10 f-w-500 f-14">
                          <li>{testimonial.name}</li>
                          <li className="f-12 f-w-300">{testimonial.place}</li>
                        </ul>
                      </div>
                      {testimonial.type === "video" &&
                        testimonial.videoUpload && (
                          <div className="ml-auto">
                            <button
                              type="button"
                              className="f-12"
                              style={{
                                border: "1px solid #ddd",
                                padding: "10px",
                                borderRadius: "25px",
                                background: "white",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setCurrentVideo(testimonial.videoUpload);
                                setVideoModalOpen(true);
                              }}
                            >
                              Watch Video
                            </button>
                          </div>
                        )}
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center">No testimonials available</Col>
            )}
          </Row>
        </Container>
      ) : (
        <TestimonialForm
          onClose={() => {
            setShowTestiForm(false);
          }}
          isEditMode={isEditMode}
          testimonialID={testimonialID}
          testimonialToEdit={testimonialToEdit}
          fetchTestimonials={fetchTestimonials}
        />
      )}
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
    </>
  );
};

export default Testimonials;
