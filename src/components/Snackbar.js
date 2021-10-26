import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./Snackbar.css";
import content_copy from "../content_copy.svg";
import error from "../error.svg";

const Snackbar = forwardRef((props, ref) => {
  const [showSnackbar, setShowSnackbar] = useState(false);

  useImperativeHandle(ref, () => ({
    show() {
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 2000);
    },
  }));

  return (
    <div
      className="snackbar"
      id={showSnackbar ? "show" : "hide"}
      style={{
        backgroundColor: props.type === "success" ? "#00F593" : "#FF0033",
        color: props.type === "success" ? "black" : "black",
      }}
    >
      <div className="symbol">
        {props.type === "success" ? (
          <img src={content_copy} />
        ) : (
          <img src={error} />
        )}
      </div>
      <div className="message">{props.message}</div>
    </div>
  );
});

export default Snackbar;
