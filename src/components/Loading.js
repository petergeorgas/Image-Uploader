import React from "react";
import "./Loading.css";
import "../App.css";

function Loading(props) {
  const { map, percentage, header } = props; // Get percentage

  console.log("FARTS:" + JSON.stringify(Object.entries(map.files)));

  return (
    <div className="flex-container">
      <div className="small-content-box">
        <div className="flex-container-inner-upload">
          <h2 className="box-header">{header}</h2>
          {Object.entries(map.files).map((file, idx) => {
            return (
              <div className="load-bar">
                <div
                  key={idx}
                  style={{ width: `${file[1].pct}%` }}
                  className="prog-bar sizing"
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Loading;
