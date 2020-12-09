import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);

export const getDateTimeFormat = (date, isTime) => {
  return isTime ? dayjs(date).format(`YYYY-MM-DD[T]HH:mm`) : dayjs(date).format(`YYYY-MM-DD`);
};

export const getEventDuration = (dateStart, dateEnd) => {
  const diff = dayjs(dateEnd).diff(dayjs(dateStart));
  const days = dayjs.duration(diff).days().toString();
  const hours = dayjs.duration(diff).hours().toString();
  const minutes = dayjs.duration(diff).minutes().toString();

  return `${days > 0 ? days + `D` : ``} ${hours > 0 ? hours.padStart(2, `0`) + `H` : ``} ${minutes.padStart(2, `0`)}M`;
};

export const sortEventTime = (eventA, eventB) => {
  const diffEventA = dayjs(eventA.date.end).diff(dayjs(eventA.date.start));
  const diffEventB = dayjs(eventB.date.end).diff(dayjs(eventB.date.start));
  return diffEventB - diffEventA;
};

export const sortEventPrice = (eventA, eventB) => {

  return eventB.price - eventA.price;
};
