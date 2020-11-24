import {getRandomInteger} from './../util';

export const createTripCostTemplate = () => {
  const price = getRandomInteger(100, 1000);
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
  </p>`;
};
