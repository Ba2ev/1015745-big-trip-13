import dayjs from "dayjs";

export const makeUniqItems = (items) => [...new Set(items)];

export const countMoneyByType = (events, type) => {
  const typeEvents = events.filter((event) => event.type === type);
  return typeEvents.reduce((sum, item) => sum + item.price, 0);
};

export const countCountsByType = (events, type) => {
  const typeEvents = events.filter((event) => event.type === type);
  return typeEvents.length;
};

export const countDurationByType = (events, type) => {
  const typeEvents = events.filter((event) => event.type === type);
  return typeEvents.reduce((sum, event) => {
    const diff = dayjs(event.date.end).diff(dayjs(event.date.start));
    const days = dayjs.duration(diff).days();
    return sum + days;
  }, 0);
};
