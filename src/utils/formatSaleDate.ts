import { DateTime } from 'luxon';

export const formatSaleDate = (
  start: number,
  end: number,
  options = { format: DateTime.DATETIME_SHORT },
): string => `${DateTime.fromMillis(start).toLocaleString(options.format)}
- 
${DateTime.fromMillis(end).toLocaleString(options.format)}`;
