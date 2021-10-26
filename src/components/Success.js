import React from "react";
import "./Success.css";
import cloud_done from "../cloud_done.svg";
import CopyToClipboard from "react-copy-to-clipboard";

function Success(props) {
  const { imgUrl } = props;

  const copyLink = () => {};

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
