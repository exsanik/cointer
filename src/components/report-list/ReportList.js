import React, { useEffect, useState } from "react";
import { getCategoryReport } from "../../state/access-actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReportItem from "../report-item/ReportItem";
import Loader from "react-loader-spinner";
import { makeCapital } from "../../services/helpers";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import "./ReportList.css";

const ReportList = ({
  startDate,
  endDate,
  categoryId,
  getCategoryReport,
  categoryReport,
  loading
}) => {
  useEffect(() => {
    getCategoryReport(startDate, endDate, categoryId);
  }, [getCategoryReport, startDate, endDate, categoryId]);
  const [saveMoney, setSaveMoney] = useState(0);
  const [categoryTitle, setCategoryTitle] = useState("Загрузка...");
  useEffect(() => {
    if (categoryReport) {
      for (let report of categoryReport) {
        setCategoryTitle(makeCapital(report.spend_category_name));
        if (!report.usefull) {
          setSaveMoney(Number(report.usefull_sum));
          break;
        }
      }
    }
  }, [categoryReport]);
  return (
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-column report-list-wrapper">
        <div className="report-list-header d-flex justify-content-between">
          <div>{categoryTitle}</div>
          <span>
            {startDate} — {endDate}
          </span>
        </div>
        {loading.typeGetCategoryReport || !categoryReport ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "88%" }}
          >
            <Loader type="ThreeDots" color="#35047F" height={100} width={100} />
          </div>
        ) : (
          <>
            {categoryReport.length !== 0 ? (
              categoryReport.map(
                (
                  {
                    date,
                    spend,
                    spend_name,
                    usefull,
                    account_name,
                    currency_type,
                    account_type
                  },
                  idx
                ) => (
                  <ReportItem
                    key={idx}
                    value={spend.slice(0, spend.length - 2)}
                    name={makeCapital(spend_name)}
                    currency={currency_type}
                    date={date}
                    usefull={usefull}
                    accountName={account_name}
                    accountType={account_type}
                  />
                )
              )
            ) : (
              <>
                <ReportItem
                  accountType="Нет данных о расходах"
                  usefull={false}
                />
              </>
            )}
            <div className="report-list-save">
              Можно съэкономить: <span>{saveMoney}₴</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  categoryReport: state.access.categoryReport,
  loading: state.access.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getCategoryReport
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ReportList);
