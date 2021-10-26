import logo from "./logo.svg";
import axios from "axios";
import "./App.css";
import image from "./image.svg";
import { useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Loading from "./components/Loading";
import Success from "./components/Success";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,

  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,

  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,

  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,

  appId: process.env.REACT_APP_FIREBASE_APP_ID,

  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();

function App() {
  const inputFile = useRef(null);

  const [file, setFile] = useState(null); // Initialize a new state variable to null.
  const [fileObj, setFileObj] = useState(null);
  const [uploadHeader, setUploadHeader] = useState("Uploading ...");

  const [pct, setPct] = useState(0);

  const [inProg, setInProg] = useState(false);

  const onChooseButtonClick = () => {
    inputFile.current.click();
    console.log(inputFile);
  };

  const handleFileChange = (event) => {
    console.log("File change!!");
    let target = event.target;
    console.log(target.files[0]);
    setFile(URL.createObjectURL(target.files[0]));
    setFileObj(target.files[0]);
  };

  const uploadFile = () => {
    console.log(file);

    // Create a ref to this new file in storage...

    const storageRef = ref(storage, fileObj.name);

    setInProg(true);
    const uploadTask = uploadBytesResumable(storageRef, fileObj); // Retrieve the promsise for upload

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // On state change
        var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`${percent}%`);
        setPct(percent);
      },
      (error) => {
        // On error
        console.log(
          "There was an error uploading the image. Please try again..."
        );
        // Maybe we can create our own snackbar here.
      },
      () => {
        // On Complete
        console.log("Image upload complete.");

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("URL: " + downloadURL);
        });
        setUploadHeader("Done.");

        setTimeout(() => {
          setFile(null);
          setFileObj(null);
          setInProg(false);
        }, 1500);
      }
    );
  };

  return <Success imgUrl="http://localhost:1414" />;
  /*
  if (inProg) {
    return <Loading percentage={pct} header={uploadHeader} />;
  } else {
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
  }*/
}

export default App;
