import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAccountByID } from "../../state/access-actions";

import AccountItem from "../account-item/AccountItem";

import "./AccountsList.css";

const AccountsList = ({ getAccountByID, user, loading }) => {
  const { accounts } = user;
  useEffect(() => {
    getAccountByID();
  }, [getAccountByID]);

  useEffect(() => {
    if (!loading.typeAddAccount) {
      getAccountByID();
    }
  }, [loading.typeAddAccount, getAccountByID]);

  return (
    <div className="account-list-wrapper">
      {accounts &&
        accounts.map(el => (
          <AccountItem
            key={el.account_id}
            id={el.account_id}
            balance={el.balance}
            type={el.account_type}
            name={el.account_name}
            currency={el.currency_type}
          />
        ))}
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.access.user,
  loading: state.access.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getAccountByID }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AccountsList);
