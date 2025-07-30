import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const HTMLTextEditor = ({ name, placeholder, state, handleChange, errors }) => {
  return (
    <>
      <ReactQuill
        theme="snow"
        value={state}
        onChange={handleChange}
        className="form-control"
        name={name}
        placeholder={placeholder}
      />
      {errors}
    </>
  );
};

export default HTMLTextEditor;
