import React from "react";

import "./OperationHistoryItem.css";

const OperationHistoryItem = ({ value, name, currency, date, usefull }) => {
  let isPos = "";
  if (value) {
    if (Number(value) > 0) {
      value = "+" + value;
      isPos = "isPositive";
    }
    value += "💸";
  }
  let useEmoji = "✔";
  if (!usefull) {
    useEmoji = "⚠";
  }
  return (
    <div className={`d-flex op-item-wrapper ${isPos}`}>
      <div className="op-item-usefull">{useEmoji}</div>
      <div className={`op-item-value ${isPos}`}>{value}</div>
      <div className="op-item-curr">{currency}</div>
      <div className="op-item-categ">{name}</div>
      <div className="op-item-date">{date}</div>
    </div>
  );
};

export default OperationHistoryItem;
