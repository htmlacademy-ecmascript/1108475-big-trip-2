import AbstractView from '../framework/view/abstract-view.js';
import { SortingType } from '../const.js';


const createSortingTemplate = (sorting) =>
  `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortingType.DAY}" ${sorting === SortingType.DAY ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortingType.TIME}" ${sorting === SortingType.TIME ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-time">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortingType.PRICE}" ${sorting === SortingType.PRICE ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>
  `;

export default class SortingView extends AbstractView {
  #currentSorting = null;
  #handleSortingChange = null;

  constructor(handleSortingChange, sorting) {
    super();
    this.#currentSorting = sorting;
    this.#handleSortingChange = handleSortingChange;
    this.element.addEventListener('change', this.#sortingChangeHandler);
  }

  get template() {
    return createSortingTemplate(this.#currentSorting);
  }

  #sortingChangeHandler = (evt) => {
    const activeSorting = evt.currentTarget[evt.target.name].value;
    this.#handleSortingChange(activeSorting);
  };
}
