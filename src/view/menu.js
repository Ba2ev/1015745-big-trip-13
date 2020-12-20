import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs trip-tabs">
    <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-item="${MenuItem.TABLE}">Table</a>
    <a class="trip-tabs__btn" href="#" data-item="${MenuItem.STATS}">Stats</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.item);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const currentActiveItem = this.getElement().querySelector(`.trip-tabs__btn--active`);
    currentActiveItem.classList.remove(`trip-tabs__btn--active`);

    const item = this.getElement().querySelector(`[data-item=${menuItem}]`);

    if (item !== null) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }
}
