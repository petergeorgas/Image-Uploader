import React from "react";
import "./Loading.css";
import "../App.css";

function Loading(props) {
  const { percentage, header } = props; // Get percentage

  const widthStyle = {
    borderRadius: "8px",
    height: "100%",
    backgroundColor: "#2F80ED",
    width: `${percentage}%`,
  };

  return (
    <div className="flex-container">
      <div className="small-content-box">
        <div className="flex-container-inner-upload">
          <h2 className="box-header">{header}</h2>
          <div className="load-bar">
            <div style={widthStyle} className="prog-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
