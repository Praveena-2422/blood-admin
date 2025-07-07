import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json"; // Ensure this path is correct!

const LottieLoader = ({ width = 60, height = 60, style = {} }) => (
  <div style={{ width, height, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
    <Lottie animationData={loadingAnimation} loop autoplay style={{ width: "100%", height: "100%" }} />
  </div>
);

export default LottieLoader;