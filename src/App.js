import { useState } from "react";
import Navigation from "./components/Navigation/Navigation";
import Facerecognition from "./components/Facerecognition/Facerecognition";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import ParticlesBg from "particles-bg";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  // Clarifai credentials
  const PAT = "c2c98aedfb534f4abfc1e7e531a481cd";
  const USER_ID = "danieldeveloper";
  const APP_ID = "facerecognitionbrain";
  const MODEL_ID = "face-detection";
  const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105"; // official version

  // Proxy URL to bypass CORS
  const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

  const onInputChange = (event) => setInput(event.target.value);

  const calculateFaceLocation = (data) => {
    try {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById("inputImage");
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        width: (clarifaiFace.right_col - clarifaiFace.left_col) * width,
        height: (clarifaiFace.bottom_row - clarifaiFace.top_row) * height,
      };
    } catch (err) {
      console.log("Bounding box error:", err);
      return null;
    }
  };

  const displayFaceBox = (box) => box && setBox(box);

  const onButtonSubmit = () => {
    setImageUrl(input);
    setErrorMsg("");

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: input,
            },
          },
        },
      ],
    });

    fetch(
      PROXY_URL +
        `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Key " + PAT,
        },
        body: raw,
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log("Clarifai API Response:", result); // <-- debug log

        if (result.outputs && result.outputs[0].data.regions) {
          const faceBox = calculateFaceLocation(result);
          displayFaceBox(faceBox);
        } else {
          setErrorMsg("No faces detected in this image.");
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
        setErrorMsg("❌ Failed to fetch face detection.");
      });
  };

  return (
    <div className="App">
      <ParticlesBg type="square" bg={true} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
      />
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <Facerecognition imageUrl={imageUrl} box={box} />
    </div>
  );
}

export default App;
