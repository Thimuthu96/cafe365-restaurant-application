import React, { useState } from "react";
import * as moment from "moment";
import { DateTime } from "luxon";

//styles
import "../App.scss";

const DateWidget = () => {
  // const [currentDate] = useState(new Date().toLocaleDateString({
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  // }));
  // const fullDate = moment(currentDate).format("MMM DD");

  const [currentDate, setCurrentDate] = useState(new Date());
  const today = DateTime.fromJSDate(currentDate).toLocaleString({
    day: "numeric",
    month: "short",
  });

  return <div className="date">{today}</div>;
};

export default DateWidget;
