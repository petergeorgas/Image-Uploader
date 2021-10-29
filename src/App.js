import "./App.css";
import image from "./assets/image.svg";
import { useRef, useState, useCallback } from "react";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Loading from "./components/Loading";
import Success from "./components/Success";
import { useDropzone } from "react-dropzone";
import sha256 from "sha256";

import Snackbar from "./components/Snackbar";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,

  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,

  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,

  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,

  appId: process.env.REACT_APP_FIREBASE_APP_ID,

  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const SnackbarType = {
  success: "success",
  fail: "fail",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();

function App() {
  const inputFile = useRef(null);

  const [file, setFile] = useState(null); // Initialize a new state variable to null.
  const [fileObj, setFileObj] = useState(null);
  const [uploadHeader, setUploadHeader] = useState("Uploading ...");
  const [downloadURL, setDownloadURL] = useState(null); // Store the URL for our uploaded file...
  const snackbarRef = useRef(null);

  const [pct, setPct] = useState(0);

  const [success, setSuccess] = useState(false);

  const [inProg, setInProg] = useState(false);

  const onChooseButtonClick = () => {
    inputFile.current.click();
    console.log(inputFile);
  };

  const onDrop = useCallback((dropFile) => {
    console.log("magma");
    const singleFile = dropFile[0]; // Grab the first file (if multiple)
    console.log(singleFile);

    if (!isDragReject) {
      setFile(URL.createObjectURL(singleFile));
      setFileObj(singleFile);
    } else {
      // Show toast!
      snackbarRef.current.show();
    }
  });

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

    const split_file_name = fileObj.name.split(".");
    const file_ext = split_file_name[split_file_name.length - 1];

    const hashFileName = sha256(fileObj.name) + "." + file_ext;

    const storageRef = ref(storage, hashFileName);

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
          setDownloadURL(downloadURL);
        });
        setUploadHeader("Done.");

        setTimeout(() => {
          setFile(null);
          setFileObj(null);
          setInProg(false);
          setSuccess(true);
        }, 1500);
      }
    );
  };

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  if (inProg) {
    return <Loading percentage={pct} header={uploadHeader} />;
  } else if (success) {
    return <Success imgUrl={downloadURL} />;
  } else {
    return (
      <div className="flex-container">
        <div className="content-box">
          <div className="flex-container-inner">
            <h2 className="box-header">Upload your image</h2>
            {!file ? (
              <div {...getRootProps()}>
                <div className="dashed-box flex-container-inner">
                  <input {...getInputProps()} />
                  <img
                    id="filler-img"
                    src={image}
                    width={150}
                    height={100}
                    alt="Filler Image"
                  />
                  <p className="drag-drop-txt">Drag & drop your image here</p>
                </div>
              </div>
            ) : (
              <div className="image-div">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <img id="uploaded-img" src={file} alt="Uploaded image" />
                </div>
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
                  accept="image/jpeg, image/png"
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
            <Snackbar
              ref={snackbarRef}
              message="Invalid file."
              type={SnackbarType.fail}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
