import dayjs from 'dayjs';

export const getDateTimeFormat = (date, isTime) => {
  return isTime ? dayjs(date).format(`YYYY-MM-DD[T]HH:mm`) : dayjs(date).format(`YYYY-MM-DD`);
};
