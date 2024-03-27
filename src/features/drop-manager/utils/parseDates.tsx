import { type DateAndTimeInfo } from '@/lib/eventsHelpers';

export const dateAndTimeToText = (date: DateAndTimeInfo, placeholder = '') => {
  if (!date.startDate) {
    return placeholder;
  }

  let formattedDate = '';
  let timeZone = '';

  const start = new Date(date.startDate);
  const startYear = start.getFullYear();
  const startMonth = start.toLocaleDateString(undefined, { month: 'short' });
  const startDay = start.toLocaleDateString(undefined, { day: 'numeric' });

  // Extract the time zone from the start date and use it at the end
  timeZone = start.toLocaleDateString(undefined, { timeZoneName: 'short' }).split(', ').pop() || '';

  formattedDate = `${startMonth} ${startDay}`;
  if (date.startTime) {
    formattedDate += ` at ${date.startTime}`;
  }

  // Only add end date information if it exists
  if (date.endDate) {
    const end = new Date(date.endDate);
    const endYear = end.getFullYear();
    const endMonth = end.toLocaleDateString(undefined, { month: 'short' });
    const endDay = end.toLocaleDateString(undefined, { day: 'numeric' });

    // Check if the year is the same for start and end date to decide if it should be repeated.
    const sameYear = startYear === endYear;

    // Check if start and end date are the same to avoid repeating the same date
    if (date.startDate !== date.endDate) {
      formattedDate += ` - ${endMonth} ${endDay}`;
      if (date.endTime) {
        formattedDate += ` at ${date.endTime}`;
      }
      // Append the year at the end only if start and end years are different
      if (!sameYear) {
        formattedDate += `, ${startYear} - ${endYear}`;
      }
    } else if (date.endTime) {
      // If it's the same day but with an end time
      formattedDate += ` - ${date.endTime}`;
    }
  }

  // Append the year if only start date is available or if start and end are in the same year
  if (
    !date.endDate ||
    start.getFullYear() ===
      (date.endDate ? new Date(date.endDate).getFullYear() : start.getFullYear())
  ) {
    formattedDate += `, ${startYear}`;
  }

  // Append the time zone at the end
  formattedDate += `, ${timeZone}`;

  return formattedDate;
};
