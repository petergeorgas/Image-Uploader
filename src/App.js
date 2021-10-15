import logo from "./logo.svg";
import "./App.css";
import image from "./image.svg";
import { useRef, useState } from "react";

function App() {
  const inputFile = useRef(null);

  const [file, setFile] = useState(null); // Initialize a new state variable to null.

  const onChooseButtonClick = () => {
    inputFile.current.click();
    console.log(inputFile);
  };

  const handleFileChange = (event) => {
    console.log("File change!!");
    let target = event.target;
    console.log(target.files[0]);
    setFile(URL.createObjectURL(target.files[0]));
  };

  const uploadFile = () => {};

  return (
    <div className="flex-container">
      <div className="content-box">
        <div className="flex-container-inner">
          <h2 className="box-header">Upload your image</h2>
          {!file ? (
            <div className="dashed-box flex-container-inner">
              <img id="filler-img" src={image} width={150} height={100} />
              <p className="drag-drop-txt">Drag & drop your image here</p>
            </div>
          ) : (
            <div>
              <img id="uploaded-img" src={file} width={350} height={220} />
            </div>
          )}

          {!file ? (
            <div style={{ textAlign: "center" }}>
              <p className="drag-drop-txt">Or</p>
              <input
                className="btn"
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
              />
              <button className="btn" onClick={onChooseButtonClick}>
                Pick a file
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <button
                className="btn"
                style={{ marginTop: "0.83em" }}
                onClick={uploadFile}
              >
                Upload
              </button>
              <p className="drag-drop-txt">Or</p>
              <input
                className="btn"
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
              />
              <button className="btn" onClick={onChooseButtonClick}>
                Pick another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
