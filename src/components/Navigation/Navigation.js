import React from "react";

const Navigation = ({ isSignedIn, onRouteChange }) => {
  return (
    <nav style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
      {isSignedIn && (
        <p
          onClick={() => onRouteChange("signout")}
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          Sign Out
        </p>
      )}
    </nav>
  );
};

export default Navigation;
