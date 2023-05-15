import * as dayjs from 'dayjs';
import { weekdaysTranslation } from './consts';

export const getDateByWeekday = (weekday: string) => {
  const weekdayNumber = Object.keys(weekdaysTranslation).find(
    key =>
      weekdaysTranslation[
        Number.parseInt(key) as keyof typeof weekdaysTranslation
      ] === weekday,
  );

  if (dayjs().day() >= Number.parseInt(weekdayNumber!))
    return dayjs()
      .day(7 + Number.parseInt(weekdayNumber!))
      .hour(8)
      .minute(0)
      .second(0)
      .toDate();

  return dayjs()
    .day(Number.parseInt(weekdayNumber!))
    .hour(8)
    .minute(0)
    .second(0)
    .toDate();
};
