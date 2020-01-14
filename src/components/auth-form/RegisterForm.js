import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInput } from "../hooks";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { register } from "../../state/access-actions";

import "./AuthForm.scss";

const RegisterForm = ({ registerResult, register }) => {
  let [email, emailInput] = useInput("email", "Почта");
  let [name, nameInput] = useInput("name", "Имя");
  let [password, passInput] = useInput("password", "Пароль");
  let [repassword, repassInput] = useInput("password", "Повтор пароля");

  let [regMsg, setRegMsg] = useState(null);

  const formSubmit = e => {
    e.preventDefault();
    if (password === repassword) {
      register(email, password, name);
    } else {
      setRegMsg("Пароли не совпадают");
    }
  };

  useEffect(() => {
    if (registerResult !== null && registerResult !== undefined) {
      if (typeof registerResult.data === "string") {
        setRegMsg(registerResult.data.slice(0, 37));
      }
    }
  }, [registerResult]);

  return (
    <>
      {regMsg === null ? null : <div className="auth-form-error">{regMsg}</div>}
      <form className="mx-auto" onSubmit={formSubmit}>
        {emailInput}
        {nameInput}
        {passInput}
        {repassInput}
        <button type="submit" className="btn btn-primary">
          Зарегистрироваться
        </button>
      </form>
      <Link to="/login">
        <div className="auth-form-regist">Вход</div>
      </Link>
    </>
  );
};

const mapStateToProps = state => ({
  registerResult: state.access.registerResult
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      register
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
