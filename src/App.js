import { useState, useEffect } from "react";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
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
  const [route, setRoute] = useState("signin"); // 'signin', 'register', 'home'
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  });

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };

  

  const onInputChange = (event) => setInput(event.target.value);

  useEffect(() => {
    fetch("https://smart-brain-api-1-8bur.onrender.com")
      .then((res) => res.json())
      .then((data) => console.log("Backend response:", data))
      .catch((err) => console.log("Backend fetch error:", err));
  }, []);

  const calculateFaceLocation = (data) => {
    try {
      const clarifaiFace =
        data.outputs[0].data.regions[0].region_info.bounding_box;
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

  fetch("https://smart-brain-api-1-8bur.onrender.com/imageurl", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: input }),
  })
    .then(res => res.json())
    .then(result => {
      if (result.outputs && result.outputs[0].data.regions) {
        // update entries
        fetch("https://smart-brain-api-1-8bur.onrender.com/image", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.id }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.entries !== undefined) {
              setUser({ ...user, entries: data.entries });
            }
          });

        const faceBox = calculateFaceLocation(result);
        displayFaceBox(faceBox);
      } else {
        setErrorMsg("No faces detected in this image.");
      }
    })
    .catch(err => {
      console.error("API Error:", err);
      setErrorMsg("❌ Failed to fetch face detection.");
    });
};

  // const onButtonSubmit = () => {
  //   setImageUrl(input);
  //   setErrorMsg("");
  //   const raw = JSON.stringify({
  //     user_app_id: {
  //       user_id: USER_ID,
  //       app_id: APP_ID,
  //     },
  //     inputs: [
  //       {
  //         data: {
  //           image: {
  //             url: input,
  //           },
  //         },
  //       },
  //     ],
  //   });

  //   fetch(
  //     PROXY_URL +
  //       `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Key " + PAT,
  //       },
  //       body: raw,
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((result) => {
  //       if (result.outputs && result.outputs[0].data.regions) {
  //         // Update entries correctly
  //         fetch("http://localhost:3001/image", {
  //           method: "PUT",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ id: user.id }),
  //         })
  //           .then((res) => res.json())
  //           .then((data) => {
  //             if (data.entries !== undefined) {
  //               setUser({ ...user, entries: data.entries }); // ✅ Set as number
  //             }
  //           })
  //           .catch((err) => console.log("Entries update error:", err));

  //         const faceBox = calculateFaceLocation(result);
  //         displayFaceBox(faceBox);
  //       } else {
  //         setErrorMsg("No faces detected in this image.");
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("API Error:", err);
  //       setErrorMsg("❌ Failed to fetch face detection.");
  //     });
  // };

  const onRouteChange = (newRoute) => {
    if (newRoute === "signout") {
      setIsSignedIn(false);
      setRoute("signin");
      setUser({ id: "", name: "", email: "", entries: 0, joined: "" });
      setImageUrl("");
      setBox({});
    } else if (newRoute === "home") {
      setIsSignedIn(true);
      setRoute("home");
    } else {
      setRoute(newRoute);
    }
  };

  return (
    <div className="App">
      <ParticlesBg type="square" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />

      {route === "home" ? (
        <>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          <Facerecognition imageUrl={imageUrl} box={box} />
        </>
      ) : route === "signin" ? (
        <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : route === "register" ? (
        <Register loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : null}
    </div>
  );
}

export default App;
