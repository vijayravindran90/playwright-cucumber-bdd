import moment from 'moment';
export const dateGenerator = (
  format: string,
  days: number,
  months: number,
  years: number
): string => {
  const date = moment()
    .add(days, 'd')
    .add(months, 'M')
    .add(years, 'y')
    .format(format);
  return date;
};
