import { DateTime } from 'luxon';

export function getDaysDiff(max: any, min: any) {
  const end = DateTime.fromFormat(max, 'yyyy LLL dd');
  const start = DateTime.fromFormat(min, 'yyyy LLL dd');
  const diffInDays = end.diff(start, 'days');

  return diffInDays.days;
}
