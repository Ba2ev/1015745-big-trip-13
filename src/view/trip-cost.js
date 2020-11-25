export const createTripCostTemplate = (events) => {
  const price = events.reduce((acc, event) => acc + event.price, 0);
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
  </p>`;
};
