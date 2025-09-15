import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";
import ValidationAlert from "../Common/Component/ValidationAlert";
import { toasterConfig } from "../../utils";
import { CREATE_BLOGS_API, UPDATE_BLOGS_API } from "../../api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchBlogs } from "../../slices/blogSlice";
import { is } from "date-fns/locale";

const initialState = {
  blogID: "",
  title: "",
  url: "",
  category: "",
  blogContent: "",
  postThumbnail: null,
  postBanner: null,
  metaKeywords: "",
  metaDescription: "",
  tags: "",
  authorName: "",
  dateOfPost: "",
};

const AddBlog = ({ onClose, isEditMode, blogDataToEdit }) => {
  const [formState, setFormState] = useState(initialState);
  const [formErrors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEditMode && blogDataToEdit) {
      setFormState({
        blogID: blogDataToEdit.blogID || "",
        title: blogDataToEdit.title || "",
        url: blogDataToEdit.url || "",
        category: blogDataToEdit.category || "",
        blogContent: blogDataToEdit.blogContent || "",
        postThumbnail: blogDataToEdit.postThumbnail || null,
        postBanner: blogDataToEdit.postBanner || null,
        metaKeywords: blogDataToEdit.metaKeywords || "",
        metaDescription: blogDataToEdit.metaDescription || "",
        tags: blogDataToEdit.tags ? blogDataToEdit.tags.join(", ") : "",
        authorName: blogDataToEdit.authorName || "",
        dateOfPost: blogDataToEdit.dateOfPost || "",
      });
    }
  }, [isEditMode, blogDataToEdit]);

  const validateField = (name, value) => {
    switch (name) {
      case "blogID":
        return value === "" ? "Blog ID is required" : "";
      case "title":
        return value.trim() === "" ? "Blog Title is required" : "";
      case "url":
        return value.trim() === "" ? "Blog URL is required" : "";
      case "category":
        return value.trim() === "" ? "Category is required" : "";
      case "blogContent":
        return value.trim() === "" ? "Blog Content is required" : "";
      case "postThumbnail":
        return !value ? "Post Thumbnail is required" : "";
      case "postBanner":
        return !value ? "Post Banner is required" : "";
      case "metaKeywords":
        return value.trim() === "" ? "Meta Keywords are required" : "";
      case "metaDescription":
        return value.trim() === "" ? "Meta Description is required" : "";
      case "tags":
        return value.trim() === "" ? "Tags are required" : "";
      case "authorName":
        return value.trim() === "" ? "Author Name is required" : "";
      //   case "dateOfPost":
      //     return value === "" ? "Date of Post is required" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const createBlog = async (blogData) => {
    try {
      const formData = formState;
      Object.keys(blogData).forEach((key) => {
        if (blogData[key] !== null && blogData[key] !== undefined) {
          if (
            (key === "postThumbnail" || key === "postBanner") &&
            blogData[key] instanceof File
          ) {
            formData[key] = blogData[key];
          } else if (Array.isArray(blogData[key])) {
            formData[key] = JSON.stringify(blogData[key]);
          } else {
            formData[key] = blogData[key];
          }
        }
      });

      const response = await axios.post(CREATE_BLOGS_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  };
  const formatDateForAPI = (date) => {
    return date.toISOString();
  };

  // Update Blog
  const updateBlog = async (id, blogData) => {
    try {
      const formData = formState;
      Object.keys(blogData).forEach((key) => {
        if (blogData[key] !== null && blogData[key] !== undefined) {
          if (
            (key === "postThumbnail" || key === "postBanner") &&
            blogData[key] instanceof File
          ) {
            formData[key] = blogData[key];
          } else if (Array.isArray(blogData[key])) {
            formData[key] = JSON.stringify(blogData[key]);
          } else {
            formData[key] = blogData[key];
          }
        }
      });

      const response = await axios.put(
        `${UPDATE_BLOGS_API}?blogID=${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formState).forEach((key) => {
      const err = validateField(key, formState[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((msg) => msg === "");

    if (isValid) {
      setIsLoading(true);
      try {
        // Prepare FormData for file uploads
        const formData = formState;
        Object.entries(formState).forEach(([key, value]) => {
          if (key === "tags") {
            // Convert tags string to array if needed
            formData[key] = value
              .split(",")
              .map((t) => t.trim())
              .join(",");
          } else if (
            (key === "postThumbnail" || key === "postBanner") &&
            value &&
            typeof value !== "string"
          ) {
            formData[key] = value;
          } else {
            formData[key] = value;
          }
        });

        // TODO: Replace with your API call for create/update blog
        // Example:
        formData["dateOfPost"] = formatDateForAPI(new Date());
        console.log(formData);
        let response;
        if (isEditMode) {
          response = await updateBlog(blogDataToEdit.blogID, formData);
        } else {
          response = await createBlog(formData);
        }
        if (response) {
          setIsLoading(false);
        }
        dispatch(fetchBlogs());
        toasterConfig(
          "success",
          isEditMode ? "Blog updated successfully" : "Blog created successfully"
        );
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to save blog data. Please try again.";
        toasterConfig("error", errorMessage);
        console.error("Error saving blog:", error);
      } finally {
        if (onClose) onClose();
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Breadcrumbs
        mainTitle={isEditMode ? "Edit Doctor" : "Add Doctor"}
        buttonTitle={"Cancel"}
        btnColor={"secondary"}
        onClick={onClose}
      />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <Form
                  className="needs-validation"
                  noValidate=""
                  onSubmit={handleSubmit}
                  style={
                    isLoading ? { pointerEvents: "none", opacity: 0.5 } : {}
                  }
                >
                  <Row>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="blogID">
                        Blog ID
                      </Label>
                      <Input
                        type="number"
                        name="blogID"
                        id="blogID"
                        value={formState.blogID}
                        onChange={handleChange}
                        placeholder="Enter blog ID"
                        invalid={!!formErrors.blogID}
                      />
                      <ValidationAlert error={formErrors.blogID} />
                    </Col>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="title">
                        Blog Title
                      </Label>
                      <Input
                        type="text"
                        name="title"
                        id="title"
                        value={formState.title}
                        onChange={handleChange}
                        placeholder="Enter blog title"
                        invalid={!!formErrors.title}
                      />
                      <ValidationAlert error={formErrors.title} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="url">
                        Blog URL
                      </Label>
                      <Input
                        type="text"
                        name="url"
                        id="url"
                        value={formState.url}
                        onChange={handleChange}
                        placeholder="Enter blog URL"
                        invalid={!!formErrors.url}
                      />
                      <ValidationAlert error={formErrors.url} />
                    </Col>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="category">
                        Category
                      </Label>
                      <Input
                        type="text"
                        name="category"
                        id="category"
                        value={formState.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                        invalid={!!formErrors.category}
                      />
                      <ValidationAlert error={formErrors.category} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" className="mb-3">
                      <Label className="form-label" for="blogContent">
                        Blog Content
                      </Label>
                      <Input
                        type="textarea"
                        name="blogContent"
                        id="blogContent"
                        rows="5"
                        value={formState.blogContent}
                        onChange={handleChange}
                        placeholder="Enter blog content"
                        invalid={!!formErrors.blogContent}
                      />
                      <ValidationAlert error={formErrors.blogContent} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="postThumbnail">
                        Post Thumbnail
                      </Label>
                      <Input
                        type="file"
                        name="postThumbnail"
                        id="postThumbnail"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFormState((prev) => ({
                            ...prev,
                            postThumbnail: file,
                          }));
                          setErrors((prev) => ({
                            ...prev,
                            postThumbnail: file
                              ? ""
                              : "Post Thumbnail is required",
                          }));
                        }}
                        invalid={!!formErrors.postThumbnail}
                      />
                      <ValidationAlert error={formErrors.postThumbnail} />
                      {/* {formState.postThumbnail &&
                        typeof formState.postThumbnail !== "string" && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(formState.postThumbnail)}
                              alt="Thumbnail Preview"
                              style={{
                                maxWidth: 120,
                                maxHeight: 80,
                                borderRadius: 8,
                              }}
                            />
                          </div>
                        )} */}
                    </Col>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="postBanner">
                        Post Banner
                      </Label>
                      <Input
                        type="file"
                        name="postBanner"
                        id="postBanner"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFormState((prev) => ({
                            ...prev,
                            postBanner: file,
                          }));
                          setErrors((prev) => ({
                            ...prev,
                            postBanner: file ? "" : "Post Banner is required",
                          }));
                        }}
                        invalid={!!formErrors.postBanner}
                      />
                      <ValidationAlert error={formErrors.postBanner} />
                      {/* {formState.postBanner &&
                        typeof formState.postBanner !== "string" && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(formState.postBanner)}
                              alt="Banner Preview"
                              style={{
                                maxWidth: 180,
                                maxHeight: 80,
                                borderRadius: 8,
                              }}
                            />
                          </div>
                        )} */}
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="metaKeywords">
                        Meta Keywords
                      </Label>
                      <Input
                        type="textarea"
                        name="metaKeywords"
                        id="metaKeywords"
                        value={formState.metaKeywords}
                        onChange={handleChange}
                        placeholder="Enter meta keywords"
                        invalid={!!formErrors.metaKeywords}
                      />
                      <ValidationAlert error={formErrors.metaKeywords} />
                    </Col>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="metaDescription">
                        Meta Description
                      </Label>
                      <Input
                        type="textarea"
                        name="metaDescription"
                        id="metaDescription"
                        value={formState.metaDescription}
                        onChange={handleChange}
                        placeholder="Enter meta description"
                        invalid={!!formErrors.metaDescription}
                      />
                      <ValidationAlert error={formErrors.metaDescription} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="tags">
                        Tags (comma separated)
                      </Label>
                      <Input
                        type="text"
                        name="tags"
                        id="tags"
                        value={formState.tags}
                        onChange={handleChange}
                        placeholder="Enter tags"
                        invalid={!!formErrors.tags}
                      />
                      <ValidationAlert error={formErrors.tags} />
                    </Col>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="authorName">
                        Author Name
                      </Label>
                      <Input
                        type="text"
                        name="authorName"
                        id="authorName"
                        value={formState.authorName}
                        onChange={handleChange}
                        placeholder="Enter author name"
                        invalid={!!formErrors.authorName}
                      />
                      <ValidationAlert error={formErrors.authorName} />
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="dateOfPost">
                        Date of Post
                      </Label>
                      <Input
                        type="date"
                        name="dateOfPost"
                        id="dateOfPost"
                        value={formState.dateOfPost}
                        onChange={handleChange}
                        placeholder="Select date"
                        invalid={!!formErrors.dateOfPost}
                      />
                      <ValidationAlert error={formErrors.dateOfPost} />
                    </Col> 
                  </Row>*/}
                  <div className="d-flex justify-content-center">
                    <Button
                      color="primary"
                      type="submit"
                      className="mt-3"
                      disabled={isLoading}
                    >
                      {isEditMode && !isLoading ? "Update Blog" : "Add Blog"}
                      {isLoading ? (
                        <i className="fa fa-spinner fa-spin ms-2"></i>
                      ) : null}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddBlog;
