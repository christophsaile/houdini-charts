import { DateTime } from 'luxon';
import { getDaysDiff } from './get-days-difference';

interface Scale {
  labels: string[];
  maxValue: number;
  tickInterval?: string;
}

export function getDateScaleLabels(values: string[]): Scale {
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
      console.log('scale not defined');
      //generateYearScale(params)
      break;
    }
    case 'months':
    case 'half_year': {
      const { labels, maxValue } = generateMonthScale(values);
      scale = {
        labels: labels,
        maxValue: maxValue,
        tickInterval: tickInterval,
      };
      break;
    }
    case 'months_days':
    case 'months_fortnight':
    case 'days':
    case 'week_days': {
      const { labels, maxValue } = generateDayScale(values);
      scale = {
        labels: labels,
        maxValue: maxValue,
        tickInterval: tickInterval,
      };
      break;
    }
    case 'hours': {
      console.log('scale not defined');
      //generateHourScale(params)
      break;
    }
    case 'minutes_fives':
    case 'minutes':
      console.log('scale not defined');
      //generateMinuteScale(params)
      break;
    case 'seconds_tens':
    case 'seconds_fives':
    case 'seconds':
      console.log('scale not defined');
      //generateSecondScale(params)
      break;
  }
  return scale;
}

function generateMonthScale(values: string[]) {
  const max = values[values.length - 1];
  const min = values[0];

  const lastMonthEnd = DateTime.fromFormat(max, 'yyyy LLL dd').endOf('month');
  const firstMonthStart = DateTime.fromFormat(min, 'yyyy LLL dd').startOf('month');

  const numberOfMonths = lastMonthEnd.diff(firstMonthStart, 'months').months;
  const numberOfDays = lastMonthEnd.diff(firstMonthStart, 'days').days;

  let months: string[] = [];
  months.push(firstMonthStart.toFormat('LLL yyyy'));

  for (let i = 0, n = numberOfMonths; i < n; i++) {
    const date: any = DateTime.fromFormat(months[i], 'LLL yyyy')
      .plus({ months: 1 })
      .toFormat('LLL yyyy');
    months.push(date);
  }

  let Scale: Scale = {
    labels: months,
    maxValue: numberOfDays,
  };

  return Scale;
}

function generateDayScale(values: string[]) {
  const max = values[values.length - 1];
  const min = values[0];

  const lastDay = DateTime.fromFormat(max, 'yyyy LLL dd');
  const firstDay = DateTime.fromFormat(min, 'yyyy LLL dd');

  const numberOfDays = lastDay.diff(firstDay, 'days').days;

  console.log(lastDay, firstDay, numberOfDays);

  let days: string[] = [];
  days.push(firstDay.toFormat('yyyy LLL dd'));

  for (let i = 0, n = numberOfDays; i < n; i++) {
    const date: any = DateTime.fromFormat(days[i], 'yyyy LLL dd')
      .plus({ days: 1 })
      .toFormat('yyyy LLL dd');
    days.push(date);
  }

  let Scale: Scale = {
    labels: days,
    maxValue: numberOfDays,
  };

  return Scale;
}
