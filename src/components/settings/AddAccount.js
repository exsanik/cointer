import React, { useEffect, useState } from "react";
import Select from "react-select";
import Loader from "react-loader-spinner";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getAllAccountTypes,
  getAllCurrencies,
  addAccount
} from "../../state/access-actions";
import { parseForDropDown } from "../../services/helpers";

import { useInput } from "../hooks";
import "./Settings.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const AddAccount = ({
  getAllAccountTypes,
  getAllCurrencies,
  addAccount,
  currencies,
  accountTypes,
  loading
}) => {
  const placeHoldCurrency = "Выбрать валюту";
  const placeHoldAccountType = "Выбрать тип счёта";
  const [dropCurrency, setDropCurrency] = useState({
    value: null,
    label: placeHoldCurrency
  });
  const [dropAccountType, setDropAccountType] = useState({
    value: null,
    label: placeHoldAccountType
  });
  const handleDropAccountType = selected => {
    setDropAccountType(selected);
  };
  const handleDropCurrency = selected => {
    setDropCurrency(selected);
  };

  const [currenciesOption, setCurrenciesOption] = useState([]);
  const [accountTypesOption, setAccountTypesOption] = useState([]);
  useEffect(() => {
    getAllAccountTypes();
    getAllCurrencies();
  }, [getAllCurrencies, getAllAccountTypes]);
  useEffect(() => {
    if (currencies) {
      setCurrenciesOption(
        parseForDropDown(currencies, "currency_type", "currency_id")
      );
      setDropCurrency({ value: undefined, label: placeHoldCurrency });
    } else {
      setDropCurrency({ value: null, label: "Загрузка..." });
    }
  }, [currencies]);
  useEffect(() => {
    if (accountTypes) {
      setAccountTypesOption(
        parseForDropDown(accountTypes, "account_type", "account_type_id")
      );
      setDropAccountType({ value: undefined, label: placeHoldAccountType });
    } else {
      setDropAccountType({ value: null, label: "Загрузка..." });
    }
  }, [accountTypes]);

  const [accountName, accountNameInput] = useInput(
    "text",
    "Название счёта",
    "acc-name-inp",
    "acc-name-fil",
    "acc-name-lab"
  );
  const [balance, balanceInput] = useInput(
    "number",
    "Начальный баланс",
    "balance-inp",
    "balance-fil",
    "balance-lab",
    10,
    0,
    9999999999
  );

  const handleForm = e => {
    e.preventDefault();
    addAccount(balance, accountName, dropCurrency.value, dropAccountType.value);
  };

  return (
    <form className="add-family-wrapper" onSubmit={handleForm}>
      {loading.typeAddAccount ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "88%" }}
        >
          <Loader
            type="BallTriangle"
            color="#f8c83a"
            height={100}
            width={100}
          />
        </div>
      ) : (
        <div>
          <span className="add-family-info">Добавить новый счёт</span>
          <div className="d-flex">
            {accountNameInput}
            {balanceInput}
            <div className="acc-type-select">
              <input
                className="acc-fake-input"
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0 }}
                defaultValue={
                  dropAccountType.label === placeHoldAccountType ||
                  dropAccountType.label === "Загрузка..."
                    ? ""
                    : dropAccountType.label
                }
                required
              />
              <Select
                noOptionsMessage={() => "Типа счёта отсутствует"}
                isDisabled={dropAccountType.value === null}
                options={accountTypesOption}
                onChange={handleDropAccountType}
                placeholder={dropAccountType.label}
              />
              <input
                className="curr-fake-input"
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0 }}
                defaultValue={
                  dropCurrency.label === placeHoldCurrency ||
                  dropCurrency.label === "Загрузка..."
                    ? ""
                    : dropCurrency.label
                }
                required
              />
              <Select
                noOptionsMessage={() => "Валюта отсутствует"}
                isDisabled={dropCurrency.value === null}
                options={currenciesOption}
                onChange={handleDropCurrency}
                placeholder={dropCurrency.label}
              />
            </div>
          </div>
          <button className="btn btn-warning acc-type-button">Добавить</button>
        </div>
      )}
    </form>
  );
};

const mapStateToProps = state => ({
  currencies: state.access.currencies,
  accountTypes: state.access.accountTypes,
  loading: state.access.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAllAccountTypes,
      getAllCurrencies,
      addAccount
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddAccount);
