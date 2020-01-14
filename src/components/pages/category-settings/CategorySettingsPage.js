import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getSpendCategories,
  getIncomeCategories
} from "../../../state/access-actions";
import { parseCategories } from "../../../services/helpers";
import Menu from "./Menu";
import AddSpendCategory from "./AddSpendCategory";
import AddIncomeCategory from "./AddIncomeCategory";

import "./CategorySetting.css";

const CategorySettingsPage = ({
  spendCategories,
  getSpendCategories,
  incomeCategories,
  getIncomeCategories
}) => {
  const [parsedSpend, setParsedSpend] = useState([]);
  useEffect(() => {
    if (spendCategories === null) {
      getSpendCategories();
    }
  }, [getSpendCategories, spendCategories]);
  useEffect(() => {
    if (spendCategories) {
      setParsedSpend(parseCategories(spendCategories));
    }
  }, [spendCategories]);

  const [parsedIncome, setParsedIncome] = useState([]);
  useEffect(() => {
    if (incomeCategories === null) {
      getIncomeCategories();
    }
  }, [getIncomeCategories, incomeCategories]);
  useEffect(() => {
    if (incomeCategories) {
      setParsedIncome(parseCategories(incomeCategories));
    }
  }, [incomeCategories]);
  console.log(incomeCategories);
  return (
    <div className="d-flex justify-content-around">
      <Menu data={parsedSpend} header={"Категории доходов"} />
      <div className="form-add-categ">
        <AddSpendCategory data={parsedSpend} />
        <AddIncomeCategory data={parsedIncome} />
      </div>
      <Menu data={parsedIncome} header={"Категории расходов"} />
    </div>
  );
};

const mapStateToProps = state => ({
  spendCategories: state.access.spendCategories,
  incomeCategories: state.access.incomeCategories
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSpendCategories,
      getIncomeCategories
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategorySettingsPage);
