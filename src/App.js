import "./App.css";
import image from "./assets/image.svg";
import { useRef, useState, useCallback, useReducer } from "react";
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
import ImagePreview from "./components/ImagePreview";

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

  const [files, setFiles] = useState([]);
  const [uploadHeader, setUploadHeader] = useState("Uploading ...");
  const [downloadURL, setDownloadURL] = useState(null); // Store the URL for our uploaded file...
  const snackbarRef = useRef(null);

  const [fileMap, setFileMap] = useState({ files: {} });

  const [pct, setPct] = useState(0);

  const [success, setSuccess] = useState(false);

  const [inProg, setInProg] = useState(false);

  const onChooseButtonClick = () => {
    inputFile.current.click();
  };

  const onDrop = useCallback((files_list) => {
    const singleFile = files_list[0]; // Grab the first file (if multiple)

    if (!isDragReject) {
      updateFiles(files_list);
    } else {
      // Show toast!
      snackbarRef.current.show();
    }
  });

  // Updates the list of files -- useful because the behavior of pressing a button & drag and drop is the exact same :)
  const updateFiles = (files_list) => {
    if (files_list.length > 4) {
      files_list = Object.entries(files_list).slice(0, 4);
    } else {
      files_list = Object.entries(files_list);
    }

    setFiles(files_list);
  };

  const newUpload = () => {
    setSuccess(false); // Reset success state to false, which will cause a redirect to the home page
    setFileMap({ files: {} });
  };

  const handleFileChange = (event) => {
    let target = event.target;
    let files_list = target.files;

    // The behavior here should be the same, we just need to determine how the UI should display multiple files vs 1...
    // I'm thinking a grid view of 4. We will only accept 4.

    updateFiles(files_list);
  };

  const uploadFile = () => {
    // Create a ref to this new file in storage...
    setInProg(true);

    files.forEach((fileObj) => {
      const name = fileObj[1].name;
      const split_file_name = name.split(".");
      const file_ext = split_file_name[split_file_name.length - 1];

      const hashFileName = sha256(name) + "." + file_ext;

      const storageRef = ref(storage, hashFileName);

      const s = {
        ...fileMap,
      };
      console.log(fileObj[1]);
      fileMap.files[name] = {
        obj: fileObj[1],
        pct: 0,
        downloadURL: "",
      };

      setFileMap(s);

      ///setFileMap({ ...fileMap, [name]: { pct: 0, downloadURL: null } }); // Add this file to file map.

      const uploadTask = uploadBytesResumable(storageRef, fileObj[1]); // Retrieve the promsise for upload

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // On state change
          var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`${fileObj[1].name}: ${percent}%`);

          const s = { ...fileMap };

          s.files[name].pct = percent;

          setFileMap(s);
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

            const s = {
              ...fileMap,
            };

            s.files[name].downloadURL = downloadURL;
            setFileMap(s);

            setDownloadURL(downloadURL);
          });

          // Once the last file completes its upload.
          if (fileObj === files[files.length - 1]) {
            setUploadHeader("Done.");
            setTimeout(() => {
              setInProg(false);
              setSuccess(true);
              setFiles([]);
            }, 1500);
          }
        }
      );
    });
  };

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  if (inProg) {
    return <Loading map={fileMap} percentage={pct} header={uploadHeader} />;
  } else if (success) {
    return <Success imgUrl={downloadURL} redirect={newUpload} />;
  } else {
    return (
      <div className="flex-container">
        <div className="content-box">
          <div className="flex-container-inner">
            <h2 className="box-header">Upload your image</h2>
            {!files.length > 0 ? (
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
                  <ImagePreview images={files} />
                </div>
              </div>
            )}

            {!files.length > 0 ? (
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
                  multiple={true}
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
                  multiple
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
