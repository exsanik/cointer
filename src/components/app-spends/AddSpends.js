import React, { useEffect, useState } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getSpendCategories, setSpend } from "../../state/access-actions";
import { useInput } from "../hooks";
import { parseAccounts, parseCategories } from "../../services/helpers";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import "react-dropdown/style.css";
import "./AddSpends.css";

const AddSpends = ({
  spendCategories,
  getSpendCategories,
  user,
  loading,
  setSpend
}) => {
  let placeholdAcc = "Выбрать счёт";
  let placeholdSpend = "Выбрать категорию";

  const [options, setOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [spendName, spendNameInput] = useInput(
    "text",
    "Название",
    "add-spend-inp",
    "add-spend-fil",
    "add-spend-lab"
  );
  const [spendPrice, spendPriceInput] = useInput(
    "number",
    "Сумма",
    "add-spend-inp-price",
    "add-spend-fil-price",
    "add-spend-lab-price"
  );

  const [checkBox, setCheckBox] = useState(false);
  const [dropSpend, setDropSpend] = useState({
    value: null,
    label: placeholdSpend
  });
  const [dropAccount, setDropAccount] = useState({
    value: null,
    label: placeholdAcc
  });

  useEffect(() => {
    getSpendCategories();
  }, [getSpendCategories]);

  useEffect(() => {
    if (spendCategories) {
      setOptions(parseCategories(spendCategories));
    }
    if (user.accounts) {
      setAccountOptions(parseAccounts(user.accounts));
    }
  }, [spendCategories, user.accounts]);

  useEffect(() => {
    if (options) {
      if (options.length === 0) {
        setDropSpend({ value: null, label: "Загрузка..." });
      } else {
        setDropSpend({ value: undefined, label: placeholdSpend });
      }
    }
    if (loading.typeAccounts) {
      setDropAccount({ value: null, label: "Загрузка..." });
    } else {
      setDropAccount({ value: undefined, label: placeholdAcc });
    }
  }, [options, loading.typeAccounts, placeholdAcc, placeholdSpend]);

  const handleSelectSpend = selected => {
    setDropSpend(selected);
  };

  const handleSelectAccount = selected => {
    setDropAccount(selected);
  };

  const checkBoxHandler = () => {
    setCheckBox(!checkBox);
  };

  const submitForm = e => {
    e.preventDefault();
    setSpend(
      dropSpend.value,
      dropAccount.value,
      spendPrice,
      spendName,
      checkBox
    );
  };

  return (
    <form onSubmit={submitForm}>
      <div className="add-spend-dropdown">
        {loading.typeSpend ? (
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
                isDisabled={dropSpend.value === null}
                options={options}
                onChange={handleSelectSpend}
                placeholder={dropSpend.label}
              />
              <input
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0, top: "10px" }}
                value={
                  dropSpend.label === placeholdSpend ? "" : dropSpend.label
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
            <div className="d-flex add-spend-inputs">
              {spendNameInput}
              {spendPriceInput}
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex add-spend-checkbox">
                <input type="checkbox" onChange={checkBoxHandler} />
                <div>Необходимая трата</div>
              </div>
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
  spendCategories: state.access.spendCategories,
  user: state.access.user,
  loading: state.access.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSpendCategories,
      setSpend
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddSpends);
