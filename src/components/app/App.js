import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { bindActionCreators } from "redux";
import {
  AuthPage,
  HomePage,
  LoadingPage,
  UserPage,
  StatisticPage,
  FamilyStatisticPage,
  CategoryReport,
  CategorySettingsPage
} from "../pages";
import Header from "../header/Header";
import { getProfile } from "../../state/access-actions";

import "./App.css";

const App = ({ user, registerResult, getProfile }) => {
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <Router>
      {user.isAuthenticated && (
        <>
          <Route path="/" component={Header} />
          <Switch>
            <Route path="/" component={HomePage} exact />
            <Route path="/user" component={UserPage} exact />
            <Route path="/statistics" component={StatisticPage} exact />
            <Route
              path="/statistics/family"
              component={FamilyStatisticPage}
              exact
            />
            <Route
              path="/statistics/:startDate/:endDate/:categoryId"
              component={CategoryReport}
              exact
            />
            <Route
              path="/category-settings"
              component={CategorySettingsPage}
              exact
            />
            <Redirect to="/" />
          </Switch>
        </>
      )}
      {(registerResult === undefined || user.isAuthenticated === undefined) && (
        <>
          <Switch>
            <Route path="/" component={LoadingPage} />
            <Redirect to="/" />
          </Switch>
        </>
      )}
      {user.isAuthenticated === false && (
        <>
          <Switch>
            <Route path="/login" component={AuthPage} exact />
            <Route path="/register" component={AuthPage} exact />
            <Redirect to="/login" />
          </Switch>
        </>
      )}
    </Router>
  );
};

const mapStateToProps = state => ({
  user: state.access.user,
  registerResult: state.access.registerResult
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getProfile
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
