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

export const sortEventDate = (eventA, eventB) => {
  return new Date(eventA.date.start) - new Date(eventB.date.start);
};

export const sortEventTime = (eventA, eventB) => {
  const diffEventA = dayjs(eventA.date.end).diff(dayjs(eventA.date.start));
  const diffEventB = dayjs(eventB.date.end).diff(dayjs(eventB.date.start));
  return diffEventB - diffEventA;
};

export const sortEventPrice = (eventA, eventB) => {

  return eventB.price - eventA.price;
};

export const isDatesEqual = (prevEvent, newEvent) => {
  return dayjs(prevEvent.date.start).isSame(newEvent.date.start, `D`) && dayjs(prevEvent.date.end).isSame(newEvent.date.end, `D`);
};

export const isEventPast = (date) => {
  return dayjs(date).diff(dayjs()) < 0;
};

export const isEventFuture = (date) => {
  return dayjs(date).diff(dayjs()) >= 0;
};

export const isPricesEqual = (prevEvent, newEvent) => {
  return prevEvent.price === newEvent.price;
};

export const isDurationsEqual = (prevEvent, newEvent) => {
  return getEventDuration(prevEvent.date.start, prevEvent.date.end) === getEventDuration(newEvent.date.start, newEvent.date.end);
};
