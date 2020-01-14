import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Avatar } from "react-avataaars";
import randomstring from "randomstring";
import { setAvatar } from "../../state/access-actions";

import "./UserProfile.css";

const UserProfile = ({ user, setAvatar }) => {
  const { loggedUserObj: userInfo } = user;

  useEffect(() => {}, [userInfo.avatar_hash]);
  useEffect(() => {}, [userInfo.family_name]);

  const handleGenerate = () => {
    setAvatar(randomstring.generate(10));
  };

  return (
    <div>
      <div className="d-flex profile-wrapper">
        <div className="profile-image">
          {userInfo.avatar_hash && <Avatar hash={userInfo.avatar_hash} />}
        </div>
        <div className="profile-info">
          <div className="profile-name">{userInfo.agent_name}</div>
          <div className="profile-email">
            <strong>Почта: </strong>
            {userInfo.email}
          </div>
          <div className="profile-family">
            <strong>Семья: </strong>
            {userInfo.family_name ? userInfo.family_name : "отсутсвует"}
          </div>
          <button className="btn btn-warning" onClick={handleGenerate}>
            Генерировать аватар
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.access.user
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setAvatar }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
