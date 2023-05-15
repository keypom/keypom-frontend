import { FormLabel, Input } from '@chakra-ui/react';
import { forwardRef, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

// onchange will send back an array of 2 datetimes
export const DatetimeRangePicker = ({ onChange, value }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [datetimes, setDatetimes] = useState(value || [new Date(), new Date()]);

  const handleDateChange = (update: Date[]) => {
    const [start, end] = update;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    const datetimes = [
      new Date(`${new Date(startDate).toDateString()} ${startTime}`),
      new Date(`${new Date(endDate).toDateString()} ${endTime}`),
    ];
    setDatetimes(datetimes);
    onChange(datetimes);
  }, [startDate, endDate, startTime, endTime]);

  useEffect(() => {
    setDatetimes(value || [new Date(), new Date()]);
  }, [value]);

  const datetimeRangeString = `${datetimes[0].toLocaleString()} - ${datetimes[1].toLocaleString()}`;

  return (
    <DatePicker
      selectsRange
      customInput={<CustomDatetimeInput datetimeValue={datetimeRangeString} />}
      endDate={endDate}
      shouldCloseOnSelect={false}
      startDate={startDate}
      onChange={handleDateChange}
    >
      <FormLabel fontSize="sm">Start time</FormLabel>
      <Input
        type="time"
        onChange={(e) => {
          setStartTime(e.target.value);
        }}
      />
      <FormLabel fontSize="sm">End time</FormLabel>
      <Input
        type="time"
        onChange={(e) => {
          setEndTime(e.target.value);
        }}
      />
    </DatePicker>
  );
};

const CustomDatetimeInput = forwardRef(({ onClick, value, datetimeValue }, ref) => {
  return (
    <Input ref={ref} placeholder="Click to select dates" value={datetimeValue} onClick={onClick} />
  );
});

CustomDatetimeInput.displayName = 'CustomDatetimeInput';
