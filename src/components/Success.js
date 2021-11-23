import React, { useRef, useState } from "react";
import "./Success.css";
import cloud_done from "../assets/cloud_done.svg";
import CopyToClipboard from "react-copy-to-clipboard";
import Snackbar from "./Snackbar";

const SnackbarType = {
  success: "success",
  fail: "fail",
};

function Success(props) {
  const snackbarRef = useRef(null);
  const { links, redirect } = props;

  const [idx, setIdx] = useState(0);

  const copyLink = () => {
    snackbarRef.current.show();
  };

  const handlePrev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
    }
  };

  const handleNext = () => {
    if (idx < links.length - 1) {
      setIdx(idx + 1); // We also need to keep track of if we're about to go over... (hide next if we are...)
    }
  };

  return (
    <div className="flex-container">
      <div className="content-box">
        <div className="flex-container-inner">
          <img src={cloud_done} className="success-icon" alt="success icon" />
          <div className="photo-nav">
            {links.length > 1 ? (
              <button
                style={
                  idx > 0
                    ? {}
                    : { backgroundColor: "#3f3f3f", cursor: "default" }
                }
                id="prev-btn"
                className="nav-btn"
                onClick={idx > 0 ? handlePrev : () => {}}
              >
                Prev
              </button>
            ) : null}

            <h2 className="box-header">Upload successful.</h2>
            {links.length > 1 ? (
              <button
                style={
                  idx < links.length - 1
                    ? {}
                    : { backgroundColor: "#3f3f3f", cursor: "default" }
                }
                id="next-btn"
                className="nav-btn"
                onClick={idx < links.length - 1 ? handleNext : () => {}}
              >
                Next
              </button>
            ) : null}
          </div>
          <div className="image-div ">
            <img
              id="uploaded-img"
              src={links[idx]}
              alt="uploaded image from cloud"
              style={{ marginBottom: "20px", marginTop: "10px" }}
            />
          </div>
          <div className="link-box">
            <div className="link-holder">
              <p className="link">{links[idx]}</p>
            </div>
            <CopyToClipboard text={links[idx]} onCopy={() => {}}>
              <button className="btn copy-btn" onClick={copyLink}>
                Copy
              </button>
            </CopyToClipboard>
            <Snackbar
              ref={snackbarRef}
              message="Link copied."
              type={SnackbarType.success}
            />
          </div>
          <div className="new-upload-box">
            <button className="btn" id="newUpldBtn" onClick={redirect}>
              New Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
