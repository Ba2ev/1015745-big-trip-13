import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.lastChild;
};

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
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
