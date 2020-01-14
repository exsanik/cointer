import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { login } from "../../state/access-actions";
import { Link, withRouter } from "react-router-dom";
import { useInput } from "../hooks";

import "./AuthForm.scss";

const LoginForm = ({ login, history, error }) => {
  let [email, emailInput] = useInput("email", "Почта");
  let [password, passInput] = useInput("password", "Пароль");
  let [errorMsg, setErrorMsg] = useState(null);

  const formSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  useEffect(() => {
    if (error !== null) {
      if (error.type === "login" && typeof error.info === "string") {
        setErrorMsg(error.info.slice(0, 37));
      }
    }
  }, [error]);

  return (
    <>
      {errorMsg === null ? null : (
        <div className="auth-form-error">{errorMsg}</div>
      )}
      <form className="mx-auto" onSubmit={formSubmit}>
        {emailInput}
        {passInput}
        <button className="btn btn-primary">Войти</button>
      </form>
      <Link to="/register">
        <div className="auth-form-regist">Регистрация</div>
      </Link>
    </>
  );
};

const mapStateToProps = state => ({
  error: state.access.error
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginForm)
);
