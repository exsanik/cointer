import React, { useEffect, useState } from "react";

import ReportList from "../report-list/ReportList";

const isDate = function(date) {
  return (
    new Date(date) !== "Invalid Date" &&
    !isNaN(new Date(date)) &&
    typeof date === "string" &&
    date.length === 10
  );
};

const CategoryReport = ({ match, history }) => {
  const [reqParams, setReqParams] = useState(null);
  useEffect(() => {
    if (match) {
      const { startDate, endDate, categoryId } = match.params;
      if (isDate(startDate) && isDate(endDate) && !isNaN(Number(categoryId))) {
        setReqParams({ startDate, endDate, categoryId: Number(categoryId) });
      } else {
        history.push("/");
      }
    }
  }, [match, history]);

  return reqParams ? <ReportList {...reqParams} /> : <div>Wrong url</div>;
};

export default CategoryReport;
