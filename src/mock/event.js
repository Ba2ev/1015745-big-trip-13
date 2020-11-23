import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateEventInfo = () => {
  const events = {
    taxi: [`Park`, `Seafront`, `City square`],
    bus: [`Rome`, `Milan`, `Modena`],
    train: [`Moscow`, `Kyiv`, `Minsk`],
    ship: [`Sweden`, `Norway`, `Finland`],
    transport: [`France`, `Germany`, `Poland`],
    drive: [`Home`, `Work`, `Relax`],
    flight: [`Geneva`, `Amserdam`, `Chamonix`],
    checkIn: [`Hassler`, `Plaza`, `Radisson`],
    sightseeing: [`London`, `Paris`, `Madrid`],
    restaurant: [`Osteria`, `Mirazur`, `Asador `],
  };

  const type = Object.keys(events)[getRandomInteger(0, Object.keys(events).length - 1)];
  const name = events[type][getRandomInteger(0, events[type].length - 1)];

  return {type, name};
};

const generateDescriptionText = () => {
  const loremText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  const loremSentences = loremText.split(`. `);
  const sentencesCount = getRandomInteger(1, 5);
  const descriptionSentences = new Set();

  for (let i = 0; i < sentencesCount; i++) {
    descriptionSentences.add(loremSentences[getRandomInteger(0, loremSentences.length - 1)]);
  }

  return `${[...descriptionSentences].join(`. `)}.`;
};

const generateDescriptionImages = () => {
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
  const durationStep = 15;
  const maxDurationDays = 3;

  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const maxSteps = (maxDurationDays * 24) / (durationStep / 60);

  const start = dayjs().add(daysGap, `day`).toDate();
  const end = dayjs(start).add(getRandomInteger(1, maxSteps) * durationStep, `minute`).toDate();

  return {
    start,
    end,
  };
};

const generateOffers = () => {
  const offerDatas = [
    {name: `add luggage`, price: 50, isActive: Boolean(getRandomInteger(0, 1))},
    {name: `Switch to comfort`, price: 80, isActive: Boolean(getRandomInteger(0, 1))},
    {name: `add meal`, price: 15, isActive: Boolean(getRandomInteger(0, 1))},
    {name: `Choose seats`, price: 5, isActive: Boolean(getRandomInteger(0, 1))},
    {name: `Travel by train`, price: 40, isActive: Boolean(getRandomInteger(0, 1))}];

  const offersCount = getRandomInteger(0, offerDatas.length);

  if (offersCount === 0) {
    return null;
  }

  const offers = new Set();

  for (let i = 0; i < offersCount; i++) {
    offers.add(offerDatas[getRandomInteger(0, offerDatas.length - 1)]);
  }

  return [...offers];
};

export const generateEvent = () => {
  const event = generateEventInfo();
  const text = generateDescriptionText();
  const images = generateDescriptionImages();
  const date = generateDates();
  const offers = generateOffers();
  const price = getRandomInteger(15, 500);
  const isFavourite = Boolean(getRandomInteger(0, 1));

  return {
    event,
    description: {
      text,
      images,
    },
    date,
    price,
    offers,
    isFavourite,
  };
};
