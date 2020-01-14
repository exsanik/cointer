import React from "react";

import "./ReportItem.css";

const ReportItem = ({
  value,
  name,
  currency,
  date,
  usefull = true,
  accountName,
  accountType
}) => {
  let isPos = "";
  if (value) {
    if (usefull) {
      isPos = "isPositive";
    }
    value += "💸";
  }
  let useEmoji = "✔";
  if (!usefull) {
    useEmoji = "⚠";
  }
  return (
    <div className={`d-flex report-item-wrapper ${isPos}`}>
      <div className="report-item-usefull">{useEmoji}</div>
      <div className={`report-item-value ${isPos}`}>{value}</div>
      <div className="report-item-curr">{currency}</div>
      <div className="report-item-accountName">{accountName}</div>
      <div className="report-item-type">{accountType}</div>
      <div className="report-item-name">{name}</div>
      <div className="report-item-date">{date}</div>
    </div>
  );
};

export default ReportItem;
