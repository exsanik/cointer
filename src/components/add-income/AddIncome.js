import React, { useEffect, useState } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getIncomeCategories, setIncome } from "../../state/access-actions";
import { useInput } from "../hooks";
import { parseAccounts, parseCategories } from "../../services/helpers";
import { Link } from "react-router-dom";

import Loader from "react-loader-spinner";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import "react-dropdown/style.css";
import "./AddIncome.css";

const AddIncome = ({
  user,
  loading,
  getIncomeCategories,
  incomeCategories,
  setIncome
}) => {
  let placeholdAcc = "Выбрать счёт";
  let placeholdIncome = "Выбрать категорию";

  const [options, setOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);

  const [incomeAmount, incomeAmountInput] = useInput(
    "number",
    "Сумма дохода",
    "add-income-inp",
    "add-income-fil",
    "add-income-lab"
  );

  const [dropIncome, setDropIncome] = useState({
    value: null,
    label: placeholdIncome
  });
  const [dropAccount, setDropAccount] = useState({
    value: null,
    label: placeholdAcc
  });
  useEffect(() => {
    getIncomeCategories();
  }, [getIncomeCategories]);

  useEffect(() => {
    if (user.accounts) {
      setAccountOptions(parseAccounts(user.accounts));
    }
    if (incomeCategories) {
      setOptions(parseCategories(incomeCategories));
    }
  }, [user.accounts, incomeCategories]);

  useEffect(() => {
    if (options) {
      if (options.length === 0) {
        setDropIncome({ value: null, label: "Загрузка..." });
      } else {
        setDropIncome({ value: undefined, label: placeholdIncome });
      }
    }
    if (loading.typeAccounts) {
      setDropAccount({ value: null, label: "Загрузка..." });
    } else {
      setDropAccount({ value: undefined, label: placeholdAcc });
    }
  }, [options, loading.typeAccounts, placeholdAcc, placeholdIncome]);

  const handleSelectIncome = selected => {
    setDropIncome(selected);
  };

  const handleSelectAccount = selected => {
    setDropAccount(selected);
  };

  const submitForm = e => {
    e.preventDefault();
    setIncome(dropIncome.value, dropAccount.value, incomeAmount);
  };
  return (
    <form onSubmit={submitForm}>
      <div className="add-spend-dropdown">
        {loading.typeIncome ? (
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
          <>
            <div className="spend-header d-flex justify-content-between">
              <div>Добавить новые расходы: </div>
              <div>
                <Link to="/category-settings">
                  <i className="fa fa-cogs"></i>
                </Link>
              </div>
            </div>
            <div className="add-spend-drops">
              <Select
                noOptionsMessage={() => "Нет категорий"}
                isDisabled={dropIncome.value === null}
                options={options}
                onChange={handleSelectIncome}
                placeholder={dropIncome.label}
              />
              <input
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0, top: "10px" }}
                value={
                  dropIncome.label === placeholdIncome ? "" : dropIncome.label
                }
                required
                readOnly
              />
              <Select
                noOptionsMessage={() => "Нет счетов"}
                isDisabled={dropAccount.value === null}
                options={accountOptions}
                onChange={handleSelectAccount}
                placeholder={dropAccount.label}
              />
              <input
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0 }}
                value={
                  dropAccount.label === placeholdAcc ? "" : dropAccount.label
                }
                required
                readOnly
              />
            </div>
            <div className="d-flex add-income-input">{incomeAmountInput}</div>
            <div className="d-flex justify-content-end">
              <button className="btn btn-warning add-spend-submit">
                Сохранить
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

const mapStateToProps = state => ({
  user: state.access.user,
  loading: state.access.loading,
  incomeCategories: state.access.incomeCategories
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getIncomeCategories, setIncome }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddIncome);
