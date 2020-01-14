import React from "react";
import DiagramDonut from "../diagram-donut/DiagramDonut";
import {
  getSpendByFamDate,
  getIncomeByFamDate
} from "../../state/access-actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const StatisticPage = ({
  getSpendByFamDate,
  getIncomeByFamDate,
  incomeByFamDate,
  spendByFamDate,
  loading
}) => {
  console.log(incomeByFamDate);
  return (
    <div className="d-flex justufy-content-start">
      <DiagramDonut
        statisticName={"Статистика доходов членов семьи в UAH"}
        requestFunc={getIncomeByFamDate}
        diagramData={incomeByFamDate}
        loading={loading.typeGetIncomeByFamDate}
      />
      <DiagramDonut
        statisticName={"Статистика расходов членов семьи в UAH"}
        requestFunc={getSpendByFamDate}
        diagramData={spendByFamDate}
        loading={loading.typeGetSpendByFamDate}
      />
    </div>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getIncomeByFamDate,
      getSpendByFamDate
    },
    dispatch
  );

const mapStateToProps = state => ({
  incomeByFamDate: state.access.incomeByFamDate,
  spendByFamDate: state.access.spendByFamDate,
  loading: state.access.loading
});
export default connect(mapStateToProps, mapDispatchToProps)(StatisticPage);
