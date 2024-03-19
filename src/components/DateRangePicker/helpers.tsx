import { format, parse } from 'date-fns';

export const canClose = (
  startDate,
  endDate,
  startTimeText,
  endTimeText,
  startTimeError,
  endTimeError,
) => {
  // If no date range is selected, allow the date picker to close
  if (
    startDate === null &&
    endDate === null &&
    startTimeText === undefined &&
    endTimeText === undefined
  ) {
    return true;
  }

  return startDate != null && !startTimeError && !endTimeError;
};

export const checkAndSetTime = (inputValue, setTimeText, setIsErr) => {
  // If the input is empty, reset the error state and the time
  if (!inputValue) {
    setTimeText('');
    setIsErr(false);
    return;
  }

  // Adjusted regex to match XX:XX AM/PM, X:XX AM/PM, or 0X:XX AM/PM
  const isValidTime = /^(1[0-2]|0?[1-9]):[0-5][0-9] [AP]M$/;

  if (isValidTime.test(inputValue)) {
    try {
      // Assuming parse and format functions are imported from a date library like date-fns
      const parsedTime = parse(inputValue, 'h:mm a', new Date());
      // Format and set the valid time using 'h:mm a' to accommodate the flexible hour format
      setTimeText(format(parsedTime, 'h:mm a'));
      setIsErr(false);
    } catch (error) {
      // If parsing fails, set an error state
      console.error('Error parsing time:', error);
      setIsErr(true);
    }
  } else {
    // If the regex test fails, set an error state
    setIsErr(true);
  }
};
