import React, { useEffect } from "react";
import AddFamily from "./AddFamily";
import JoinFamily from "./JoinFamily";
import AddAccount from "./AddAccount";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAllFamilies } from "../../state/access-actions";

import "./Settings.css";

const Settings = ({ getAllFamilies, user }) => {
  useEffect(() => {
    getAllFamilies();
  }, [getAllFamilies, user.loggedUserObj.family_name]);

  return (
    <div className="settings-wrapper">
      <AddFamily />
      <JoinFamily />
      <AddAccount />
    </div>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAllFamilies
    },
    dispatch
  );

const mapStateToProps = store => ({
  user: store.access.user
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
