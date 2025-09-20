import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import TableSkeleton from "../Common/Component/TableSkeleton";
import TableComponent from "../Common/Component/TableComponent";
import { Button, Card, Col, Container, Row } from "reactstrap";
import axios from "axios";
import { BLOGS_API } from "../../api";
import CardSkeleton from "../Common/Component/CardSkeleton";
import AddBlog from "./AddBlog";
import { useDispatch, useSelector } from "react-redux";
import { deleteBlog, fetchBlogs } from "../../slices/blogSlice";
import ConfirmationAlert from "../Common/Component/ConfirmationAlert";
import { set } from "date-fns";
import { toasterConfig } from "../../utils";

const Blog = () => {
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [blogDataToEdit, setBlogDataToEdit] = useState();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [blogId, setBlogId] = useState("");
  const [blogTitle, setBlogTitle] = useState("");

  const dispatch = useDispatch();
  const {
    data: blogs,
    loading,
    error,
  } = useSelector((state) => {
    return state.blogs.blogs;
  });

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const editBlog = (data) => {
    setBlogDataToEdit(data);
    setIsEditMode(true);
    setShowAddBlog(true);
  };

  const deleteBlogData = async (id) => {
    try {
      const response = await axios.delete(`${BLOGS_API}?blogID=${id}`);
      if (response) {
        dispatch(fetchBlogs());
        toasterConfig("success", "Blog deleted successfully");
        setIsDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <>
      {!showAddBlog ? (
        <>
          <Breadcrumbs
            mainTitle={"Blogs"}
            buttonTitle={"Add Blog"}
            onClick={() => {
              setIsEditMode(false);
              setShowAddBlog(true);
            }}
          />

          <Container fluid={true}>
            <Row className="widget-grid">
              {loading ? (
                <CardSkeleton />
              ) : (
                <>
                  {blogs?.length > 0 &&
                    blogs?.map((blog) => (
                      <Col
                        lg="4"
                        md="4"
                        sm="12"
                        xs="12"
                        key={blog.blogID}
                        className="mb-3"
                      >
                        <div className="card">
                          <img
                            src={blog.postThumbnail}
                            className="card-img-top p-2 rounded-4"
                            alt="Blog"
                            style={{ height: "150px", objectFit: "cover" }}
                          />
                          <div className="card-body p-4">
                            <h5
                              className="card-title"
                              style={{
                                display: "inline-block",
                                maxWidth: "100%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                verticalAlign: "bottom",
                              }}
                              title={blog.title}
                            >
                              {blog.title}
                            </h5>
                            <p
                              className="card-text f-12"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 5,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxHeight: "5em",
                              }}
                            >
                              {blog.blogContent}
                            </p>
                            <span className="text-info f-12">Read more...</span>
                            <div className="d-flex">
                              <Button
                                color="primary"
                                className="me-2"
                                onClick={() => editBlog(blog)}
                              >
                                Edit
                              </Button>
                              <Button
                                color="secondary"
                                onClick={() => {
                                  setBlogId(blog.blogID);
                                  setBlogTitle(blog.title);
                                  setIsDeleteConfirmOpen(true);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                </>
              )}
            </Row>
          </Container>
        </>
      ) : (
        <AddBlog
          onClose={() => setShowAddBlog(false)}
          isEditMode={isEditMode}
          blogDataToEdit={blogDataToEdit}
        />
      )}
      <ConfirmationAlert
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        handleConfirm={() => deleteBlogData(blogId)}
        title={blogTitle}
      />
    </>
  );
};

export default Blog;
