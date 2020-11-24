
export const createTripInfoTemplate = (routeList) => {
  const route = routeList.length > 3 ? `${routeList[0]} &mdash; ... &mdash; ${routeList[routeList.length - 1]}` : routeList.join(` &mdash; `);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${route}</h1>
      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>
  </section>`;
};
