import React, { useEffect } from "react";
import OperationHistoryItem from "../operation-history-item/OperationHistoryItem";
import { getOpHistory } from "../../state/access-actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeCapital } from "../../services/helpers";
import Loader from "react-loader-spinner";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import "./OperationHistoryList.css";

const OperationHistoryList = ({ opHistory, loading, getOpHistory }) => {
  useEffect(() => {
    if (!loading.typeSpend && !loading.typeIncome) {
      getOpHistory();
    }
  }, [getOpHistory, loading.typeSpend, loading.typeIncome]);
  return (
    <div className="d-flex flex-column op-history-wrapper">
      <div className="op-history-header">История доходов и расходов</div>
      {loading.typeOpHistory || !opHistory ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "88%" }}
        >
          <Loader type="ThreeDots" color="#35047F" height={100} width={100} />
        </div>
      ) : (
        <div className="d-flex flex-column">
          {opHistory.length !== 0 ? (
            opHistory.map(({ value, name, currency, date, usefull }, idx) => (
              <OperationHistoryItem
                key={idx}
                value={value}
                name={makeCapital(name)}
                currency={currency}
                date={date}
                usefull={usefull}
              />
            ))
          ) : (
            <>
              <OperationHistoryItem />
              <OperationHistoryItem name="История пустая" />
            </>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  opHistory: state.access.opHistory,
  loading: state.access.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getOpHistory }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OperationHistoryList);
