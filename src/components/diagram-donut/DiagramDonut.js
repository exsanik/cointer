import React, { useState, useEffect } from "react";
import DonutChart from "react-donut-chart";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import Loader from "react-loader-spinner";

import "./DiagramDonut.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const DiagramDonut = ({
  statisticName,
  requestFunc,
  diagramData,
  loading,
  clickFunc = () => {},
  setDate: setSpendDate,
  spendStatisticDate
}) => {
  const [date, setDate] = useState(null);
  const [donutData, setDonutData] = useState([]);
  const handleDateChange = newDate => {
    if (setSpendDate) {
      setSpendDate(newDate);
    } else {
      setDate(newDate);
    }
  };
  useEffect(() => {
    if (date) {
      requestFunc(
        date[0].toISOString().substring(0, 10),
        date[1].toISOString().substring(0, 10)
      );
    } else if (spendStatisticDate) {
      requestFunc(
        spendStatisticDate[0].toISOString().substring(0, 10),
        spendStatisticDate[1].toISOString().substring(0, 10)
      );
    }
  }, [date, requestFunc, spendStatisticDate]);

  useEffect(() => {
    if (Array.isArray(diagramData)) {
      const resArray = diagramData.map(({ label, value, id }) => ({
        label,
        value: Number(value),
        id
      }));
      setDonutData(resArray);
    }
  }, [diagramData]);

  return (
    <div className="diagram-wrapper">
      <h3 className="statistic-name">{statisticName}</h3>
      <div className="d-flex justify-content-center picker-wrapper">
        <DateRangePicker
          onChange={handleDateChange}
          value={spendStatisticDate ? spendStatisticDate : date}
        />
      </div>
      <div className="d-flex justify-content-center donner-wrapper">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              width: "720px",
              height: "88%",
              position: "relative",
              top: "100px",
              right: "130px"
            }}
          >
            <Loader type="Circles" color="#5907D3" height={100} width={100} />
          </div>
        ) : (
          <DonutChart
            data={donutData}
            width={720}
            className="stat"
            formatValues={(values, total) => {
              let msg = "0%";
              if (donutData.length !== 0) {
                msg =
                  ((values / total) * 100).toFixed(2) + "% - " + values + "₴";
              }
              return msg;
            }}
            onClick={item => {
              if (spendStatisticDate) {
                clickFunc(
                  spendStatisticDate[0].toISOString().substring(0, 10),
                  spendStatisticDate[1].toISOString().substring(0, 10),
                  item.id
                );
              } else {
                clickFunc(
                  date[0].toISOString().substring(0, 10),
                  date[1].toISOString().substring(0, 10),
                  item.id
                );
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DiagramDonut;
