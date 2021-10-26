import React, { useRef } from "react";
import "./Success.css";
import cloud_done from "../cloud_done.svg";
import CopyToClipboard from "react-copy-to-clipboard";
import Snackbar from "./Snackbar";

const SnackbarType = {
  success: "success",
  fail: "fail",
};

function Success(props) {
  const snackbarRef = useRef(null);
  const { imgUrl } = props;

  const copyLink = () => {
    snackbarRef.current.show();
  };

  return (
    <div className="flex-container">
      <div className="content-box">
        <div className="flex-container-inner">
          <img src={cloud_done} className="success-icon" />
          <h2 className="box-header">Upload successful.</h2>
          <div>
            <img id="uploaded-img" src={imgUrl} width={350} height={220} />
          </div>
          <div className="link-box">
            <div className="link-holder">
              <p className="link">{imgUrl}</p>
            </div>
            <CopyToClipboard text={imgUrl} onCopy={() => {}}>
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
        </div>
      </div>
    </div>
  );
}

export default Success;