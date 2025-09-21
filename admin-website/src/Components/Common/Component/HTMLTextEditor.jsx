import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CKEditors from 'react-ckeditor-component';

const HTMLTextEditor = ({ name, placeholder, state, handleChange, errors }) => {
  return (
    <>
      {/* <ReactQuill
        theme="snow"
        value={state}
        onChange={handleChange}
        className="form-control"
        name={name}
        placeholder={placeholder}
      /> */}
      <CKEditors
        activeclassName="p10"
        content={state}
        events={{
          change: handleChange,
        }}
      />
      {errors}
    </>
  );
};

export default HTMLTextEditor;
