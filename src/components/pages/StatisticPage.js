import React from "react";
import DiagramDonut from "../diagram-donut/DiagramDonut";
import {
  getSpendByDate,
  getIncomeByDate,
  setDate
} from "../../state/access-actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

const StatisticPage = ({
  getSpendByDate,
  getIncomeByDate,
  incomeByDate,
  spendByDate,
  loading,
  history,
  setDate,
  spendStatisticDate
}) => {
  const onCategoryClickHandler = (dateStart, dateEnd, categoryId) => {
    history.push(`/statistics/${dateStart}/${dateEnd}/${categoryId}`);
  };
  return (
    <div className="d-flex justufy-content-start">
      <DiagramDonut
        statisticName={"Статистика доходов в UAH"}
        requestFunc={getIncomeByDate}
        diagramData={incomeByDate}
        loading={loading.typeGetIncomeByDate}
      />
      <DiagramDonut
        statisticName={"Статистика расходов в UAH"}
        requestFunc={getSpendByDate}
        diagramData={spendByDate}
        loading={loading.typeGetSpendByDate}
        clickFunc={onCategoryClickHandler}
        setDate={setDate}
        spendStatisticDate={spendStatisticDate}
      />
    </div>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getIncomeByDate,
      getSpendByDate,
      setDate
    },
    dispatch
  );

const mapStateToProps = state => ({
  incomeByDate: state.access.incomeByDate,
  spendByDate: state.access.spendByDate,
  loading: state.access.loading,
  spendStatisticDate: state.access.spendStatisticDate
});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(StatisticPage)
);
