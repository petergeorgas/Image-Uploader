import React from "react";
import "./ImagePreview.css";

function ImagePreview(props) {
  const { images } = props;

  console.log(images);

  if (images.length === 1) {
    // Show one fullscreen preview.
    return (
      <img
        id="uploaded-img"
        src={URL.createObjectURL(images[0][1])}
        alt="Uploaded image"
      />
    );
  } else {
    const img_elements = images.map((image, idx) => {
      return (
        <div key={idx} className="grid-element">
          <img className="grid-img" src={URL.createObjectURL(image[1])} />
        </div>
      );
    });

    return <div className="grid-box">{img_elements}</div>;
  }
}

export default ImagePreview;
