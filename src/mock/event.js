import dayjs from 'dayjs';
import {eventData} from './eventData';
import {getRandomInteger} from '../utils/common.js';

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateType = () => {
  return Object.keys(eventData.offers)[getRandomInteger(0, Object.keys(eventData.offers).length - 1)];
};

const generatePlaceName = () => {
  return eventData.places[getRandomInteger(0, eventData.places.length - 1)];
};

export const generateDescriptionText = () => {
  const loremText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  const loremSentences = loremText.split(`. `);
  const sentencesCount = getRandomInteger(1, 5);
  const descriptionSentences = new Set();

  for (let i = 0; i < sentencesCount; i++) {
    descriptionSentences.add(loremSentences[getRandomInteger(0, loremSentences.length - 1)]);
  }

  return `${[...descriptionSentences].join(`. `)}.`;
};

export const generateDescriptionImages = () => {
  const imagesCount = getRandomInteger(0, 5);

  if (imagesCount === 0) {
    return null;
  }

  const descriptionImagesLinks = [];

  for (let i = 0; i < imagesCount; i++) {
    descriptionImagesLinks.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return descriptionImagesLinks;
};

const generateDates = () => {
  const maxDaysGap = 7;
  const durationStep = 5;
  const maxDurationDays = 3;

  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const maxSteps = (maxDurationDays * 24) / (durationStep / 60);

  const start = dayjs().add(daysGap, `day`).add(getRandomInteger(1, maxSteps) * durationStep, `minute`).toDate();
  const end = dayjs(start).add(getRandomInteger(1, maxSteps) * durationStep, `minute`).toDate();

  return {
    start,
    end,
  };
};

export const generateOffers = (type) => {

  const offersList = eventData.offers[type];

  if (offersList.length === 0) {
    return null;
  }

  const offers = {};

  offersList.forEach((place) => {
    offers[place] = {};
    offers[place].price = getRandomInteger(0, 50);
    offers[place].isActive = Boolean(getRandomInteger(0, 1));
  });
  return offers;
};

export const generateEvent = () => {
  const id = generateId();
  const type = generateType();
  const placeName = generatePlaceName();
  const placeText = generateDescriptionText();
  const placeImages = generateDescriptionImages();
  const date = generateDates();
  const offers = generateOffers(type);
  const price = getRandomInteger(15, 500);
  const isFavourite = Boolean(getRandomInteger(0, 1));

  return {
    id,
    type,
    offers,
    placeName,
    placeText,
    placeImages,
    date,
    price,
    isFavourite,
  };
};
