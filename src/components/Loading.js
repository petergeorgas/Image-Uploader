import React from "react";
import "./Loading.css";
import "../App.css";

function Loading(props) {
  const { map, percentage, header } = props; // Get percentage

  console.log("FARTS:" + JSON.stringify(Object.entries(map.files)));

  console.log("0" + Object.entries(map.files)[0][0]);
  return (
    <div className="flex-container">
      <div className="small-content-box">
        <div className="flex-container-inner-upload">
          <h2 className="box-header">{header}</h2>
          {Object.entries(map.files).map((file, idx) => {
            return (
              <div key={idx} className="entry">
                <img
                  className="thumbnail"
                  src={URL.createObjectURL(file[1].obj)}
                />
                <div className="load-bar">
                  <div
                    style={{ width: `${file[1].pct}%` }}
                    className="prog-bar sizing"
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Loading;
