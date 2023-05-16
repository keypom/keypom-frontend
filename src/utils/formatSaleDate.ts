import { DateTime } from 'luxon';

export const formatSaleDate = (
  start: number,
  end: number,
  options = { format: DateTime.DATE_MED },
): string => `${DateTime.fromMillis(start).toLocaleString(options.format)}
- 
${DateTime.fromMillis(end).toLocaleString(options.format)}`;
