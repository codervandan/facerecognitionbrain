import React from "react";
import "./Facerecognition.css";

const Facerecognition = ({ imageUrl, box }) => (
  <div className="center ma">
    <div className="image-container" style={{ position: "relative", display: "inline-block" }}>
      {imageUrl && <img id="inputImage" src={imageUrl} alt="" width="500px" />}
      {box && box.width && (
        <div
          className="bounding-box"
          style={{
            top: `${box.topRow}px`,
            left: `${box.leftCol}px`,
            width: `${box.width}px`,
            height: `${box.height}px`,
          }}
        ></div>
      )}
    </div>
  </div>
);

export default Facerecognition;
