import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthForm.scss";

const AuthForm = () => {
  return (
    <div className="d-flex justify-content-center auth-form-parent">
      <div className="d-flex auth-form-pos justify-content-center flex-column">
        <Router>
          <Switch>
            <Route path="/login" component={LoginForm} exact />
            <Route path="/register" component={RegisterForm} exact />
            <Redirect to="/login" />
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default AuthForm;
