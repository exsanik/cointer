import React, { useState, useEffect } from "react";
import Select from "react-select";
import Loader from "react-loader-spinner";

import { useInput } from "../../hooks";
import "./../../settings/Settings.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addSpendCategory } from "../../../state/access-actions";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const AddSpendCategory = ({ data, addSpendCategory, loading }) => {
  const joinFamPlacehold = "Выбрать родительскую категорию";
  const [options, setOptions] = useState([]);
  const [dropSpend, setDropSpend] = useState({
    value: null,
    label: joinFamPlacehold
  });
  const [addSpend, addSpendInput] = useInput(
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
      setDropSpend({ value: undefined, label: joinFamPlacehold });
    } else {
      setDropSpend({ value: null, label: "Загрузка..." });
    }
  }, [data]);

  const handleDropCategories = selected => {
    setDropSpend(selected);
  };
  const handleForm = async e => {
    e.preventDefault();
    if (!dropSpend.value) {
      addSpendCategory(null, addSpend);
    } else {
      addSpendCategory(dropSpend.value, addSpend);
    }
  };

  return (
    <form className="add-family-wrapper add-spend-categ" onSubmit={handleForm}>
      {loading.typeAddSpendCategory ? (
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
            <div className="add-family-info">Добавить категорию расходов</div>
          </div>
          <div className="d-flex flex-column">
            <div className="join-fam-select">
              <Select
                noOptionsMessage={() => "Категории не загружены"}
                isDisabled={dropSpend.value === null}
                options={options}
                onChange={handleDropCategories}
                placeholder={dropSpend.label}
              />
            </div>
            <div className="d-flex add-spend-input">{addSpendInput}</div>
          </div>
          <button className="btn btn-warning">Добавить</button>
        </div>
      )}
    </form>
  );
};

const mapStateToProps = state => ({
  loading: state.access.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addSpendCategory
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddSpendCategory);
