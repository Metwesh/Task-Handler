import { useEffect, useState } from "react";
import "./Clock.css";

export default function Clock() {
  const [weekDayState, setWeekDayState] = useState<number>(0);
  const [yearState, setYearState] = useState<number>(0);
  const [monthState, setMonthState] = useState<number>(0);
  const [monthDayState, setMonthDayState] = useState<number>(0);
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthDays = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
    "13th",
    "14th",
    "15th",
    "16th",
    "17th",
    "18th",
    "19th",
    "20th",
    "21st",
    "22nd",
    "23rd",
    "24th",
    "25th",
    "26th",
    "27th",
    "28th",
    "29th",
    "30th",
    "31st",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect((): void => {
    const date = new Date();
    setWeekDayState(date.getDay());
    setMonthState(date.getMonth());
    setMonthDayState(date.getDate());
    setYearState(date.getFullYear());
  }, []);

  return (
    <div className="border border-info pe-2 rounded-3">
      <span className="ms-2 me-2 fw-bold">{weekDays[weekDayState]}</span>
      <span className="clock-divider"></span>

      <span className="ms-2 me-2 fw-bold">{months[monthState]}</span>
      <span className="clock-divider"></span>
      <span className="ms-2 me-2 fw-bold">{monthDays[monthDayState - 1]}</span>
      <span className="clock-divider"></span>
      <span className="ms-2 fw-bold">{yearState}</span>
    </div>
  );
}
