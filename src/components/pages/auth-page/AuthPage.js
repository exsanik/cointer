import React from "react";
import AuthForm from "../../auth-form/AuthForm";

import "./AuthPage.css";
import coinlogo from "../../../img/coin.png";

const AuthPage = () => {
  return (
    <div className="auth-page-bg">
      <div className="d-flex auth-header">
        <h1>Cointer</h1>
        <div className="auth-logo">
          <img src={coinlogo} alt="logo" />
        </div>
      </div>
      <AuthForm />
    </div>
  );
};

export default AuthPage;
