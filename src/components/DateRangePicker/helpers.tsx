import { DateTime } from 'luxon';

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
  const parsedTime = DateTime.fromFormat(inputValue, 'h:mm a');
  if (parsedTime.isValid) {
    setTimeText(parsedTime.toFormat('h:mm a'));
    setIsErr(false);
  } else {
    console.error('Error parsing time:', parsedTime.invalidReason);
    setIsErr(true);
  }
};
