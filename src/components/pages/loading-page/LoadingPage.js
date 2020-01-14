import React from "react";
import Loader from "react-loader-spinner";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./LoadingPage.css";

const LoadingPage = () => {
  return (
    <div className="loader-bg d-flex justify-content-center align-items-center">
      <div className="loader-pos">
        <Loader
          type="MutatingDots"
          color="rgb(89, 7, 211)"
          height={100}
          width={100}
        />
      </div>
    </div>
  );
};

export default LoadingPage;
