import React, { useEffect, useState } from "react";

const DateTimePicker = ({
  onDateTimeChange,
  text,
  initialDate,
  initialTime,
}) => {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (date && time) {
      const dateTimeString = new Date(`${date}T${time}`).toISOString();
      onDateTimeChange(dateTimeString);
    }
  }, [date, time, onDateTimeChange]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  return (
    <div className="date-time-picker">
      <label>{text}</label>
      <div className="date-time">
        <input type="date" value={date} onChange={handleDateChange} />
        <input type="time" value={time} onChange={handleTimeChange} />
      </div>
    </div>
  );
};

export default DateTimePicker;
