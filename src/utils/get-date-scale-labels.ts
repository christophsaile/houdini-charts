import { DateTime } from 'luxon';
import { getDaysDiff } from './get-days-difference';

interface Scale {
  labels: string[];
  maxValue: number;
}

export function getDateScaleLabels(values: string[]): Scale {
  // todo: check if +1 for current day is needed
  const daysDifference = getDaysDiff(values[values.length - 1], values[0]) + 1;
  const yearsDiff = daysDifference / 365;
  const hoursDiff = daysDifference * 24;
  const minutesDiff = hoursDiff * 60;
  const secondsDiff = minutesDiff * 60;
  let tickInterval;
  switch (true) {
    case yearsDiff > 5:
      tickInterval = 'years';
      break;
    case daysDifference > 800:
      tickInterval = 'half_year';
      break;
    case daysDifference > 180:
      tickInterval = 'months';
      break;
    case daysDifference > 90:
      tickInterval = 'months_fortnight';
      break;
    case daysDifference > 60:
      tickInterval = 'months_days';
      break;
    case daysDifference > 30:
      tickInterval = 'week_days';
      break;
    case daysDifference > 2:
      tickInterval = 'days';
      break;
    case hoursDiff > 2.4:
      tickInterval = 'hours';
      break;
    case minutesDiff > 15:
      tickInterval = 'minutes_fives';
      break;
    case minutesDiff > 5:
      tickInterval = 'minutes';
      break;
    case minutesDiff > 1:
      tickInterval = 'seconds_tens';
      break;
    case secondsDiff > 20:
      tickInterval = 'seconds_fives';
      break;
    default:
      tickInterval = 'seconds';
      break;
  }

  let scale: Scale = { labels: [], maxValue: 0 };
  switch (tickInterval) {
    case 'years': {
      //generateYearScale(params)
      break;
    }
    case 'months':
    case 'half_year': {
      scale = generateMonthScale(values);
      break;
    }
    case 'months_days':
    case 'months_fortnight':
    case 'days':
    case 'week_days': {
      scale = generateMonthScale(values);
      //generateDayScale(params)
      break;
    }
    case 'hours': {
      //generateHourScale(params)
      break;
    }
    case 'minutes_fives':
    case 'minutes':
      //generateMinuteScale(params)
      break;
    case 'seconds_tens':
    case 'seconds_fives':
    case 'seconds':
      //generateSecondScale(params)
      break;
  }
  return scale;
}

function generateMonthScale(values: string[]) {
  const max = values[values.length - 1];
  const min = values[0];

  const lastMonth = DateTime.fromFormat(max, 'yyyy LLL dd');
  const firstMonth = DateTime.fromFormat(min, 'yyyy LLL dd');
  const diffInMonths = lastMonth.diff(firstMonth, ['months', 'days']);

  let months: string[] = [];
  months.push(firstMonth.toFormat('LLL yyyy'));

  for (let i = 0; i < diffInMonths.months + 1; i++) {
    const date: any = DateTime.fromFormat(months[i], 'LLL yyyy')
      .plus({ months: 1 })
      .toFormat('LLL yyyy');
    months.push(date);
  }
  const passedDaysInFirstMonth = firstMonth.day;
  const newStart = firstMonth.minus({ days: passedDaysInFirstMonth });

  const daysInLastMonth = lastMonth.daysInMonth;
  const passedDaysInLastMonth = lastMonth.day;
  const lastMonthDiff = daysInLastMonth - passedDaysInLastMonth;
  const newEnd = lastMonth.plus({ days: lastMonthDiff });

  const numberOfDays = newEnd.diff(newStart, 'days').days;

  let Scale: Scale = {
    labels: months,
    maxValue: numberOfDays,
  };

  return Scale;
}
