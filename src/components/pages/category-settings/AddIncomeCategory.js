import React, { useState, useEffect } from "react";
import Select from "react-select";
import Loader from "react-loader-spinner";

import { useInput } from "../../hooks";
import "./../../settings/Settings.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addIncomeCategory } from "../../../state/access-actions";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const AddIncomeCategory = ({ data, addIncomeCategory, user, loading }) => {
  const joinFamPlacehold = "Выбрать родительскую категорию";
  const [options, setOptions] = useState([]);
  const [dropIncome, setDropIncome] = useState({
    value: null,
    label: joinFamPlacehold
  });
  const [nameIncomeCategory, setNameIncomeCategory] = useInput(
    "text",
    "Название",
    "pin-fam-inp",
    "pin-fam-fil",
    "pin-fam-lab",
    100
  );

  useEffect(() => {
    if (data) {
      setOptions([{ value: undefined, label: joinFamPlacehold }, ...data]);
      setDropIncome({ value: undefined, label: joinFamPlacehold });
    } else {
      setDropIncome({ value: null, label: "Загрузка..." });
    }
  }, [data]);

  const handleDropIncome = selected => {
    setDropIncome(selected);
  };
  const handleForm = e => {
    e.preventDefault();
    if (!dropIncome.value) {
      addIncomeCategory(null, nameIncomeCategory);
    } else {
      addIncomeCategory(dropIncome.value, nameIncomeCategory);
    }
  };

  return (
    <div className="add-income-categ-weapper">
      <form
        className="add-family-wrapper add-income-categ"
        onSubmit={handleForm}
      >
        {loading.typeAddIncomeCategory ? (
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
            <div className="d-flex">
              <div className="add-family-info">Добавить категорию доходов</div>
            </div>
            <div className="d-flex flex-column">
              <div className="join-fam-select">
                <Select
                  noOptionsMessage={() => "Категории не загружены"}
                  isDisabled={dropIncome.value === null}
                  options={options}
                  onChange={handleDropIncome}
                  placeholder={dropIncome.label}
                />
              </div>
              <div className="d-flex add-spend-input">
                {setNameIncomeCategory}
              </div>
            </div>
            <button className="btn btn-warning">Добавить</button>
          </div>
        )}
      </form>
    </div>
  );
};

const mapStateToProps = state => ({
  loading: state.access.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addIncomeCategory
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddIncomeCategory);
