import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { logout } from "../../state/access-actions";
import { Avatar } from "react-avataaars";
import { Link } from "react-router-dom";

import "./Header.css";
import coinLogo from "../../img/coin.png";

const Header = ({ logout, user }) => {
  const { agent_name: name } = user;

  useEffect(() => {}, [user.avatar_hash]);
  return (
    <div className="header d-flex justify-content-between">
      <div className="header-logo d-flex">
        <img src={coinLogo} alt="coin logo" />
        <Link to="/">
          <h2>Cointer</h2>
        </Link>
      </div>
      <div className="header-stat-link">
        <Link to="/statistics">
          <div>Личная статистика</div>
        </Link>
      </div>
      <div className="header-stat-link">
        <Link to="/statistics/family">
          <div>Семейная статистика</div>
        </Link>
      </div>
      <div className="header-user">
        <Link to="/user">
          <span>{name} </span>
          {user.avatar_hash && <Avatar hash={user.avatar_hash} />}
        </Link>
        <button className="btn btn-outline-primary" onClick={logout}>
          Выход
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.access.user.loggedUserObj
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      logout
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Header);
