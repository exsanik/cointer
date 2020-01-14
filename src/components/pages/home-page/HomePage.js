import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAccountByID } from "../../../state/access-actions";

import AddSpends from "../../app-spends/AddSpends";
import AddIncome from "../../add-income/AddIncome";

import "./HomePage.css";
import OperationHistoryList from "../../operation-history-list/OperationHistoryList";

const HomePage = ({ getAccountByID }) => {
  useEffect(() => {
    getAccountByID();
  }, [getAccountByID]);
  return (
    <div className="d-flex justify-content-between home-page-container">
      <OperationHistoryList />
      <div className="d-flex flex-column home-page-wrapper">
        <AddSpends />
        <AddIncome />
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAccountByID
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(HomePage);
