import { DateFormat } from '../const.js';
import { getDurationString, huminazeDate } from '../util.js';
import AbstractView from '../framework/view/abstract-view.js';


const createPointTemplate = (point, checkedOffers, destination) => {
  const {basePrice, isFavorite, type, dateFrom, dateTo } = point;

  const favoritePoint = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  const checkedOffersTemplate = checkedOffers.length
    ? `
      <ul class="event__selected-offers">
        ${checkedOffers.map((offer) =>
    `<li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
          </li>`).join('')}
      </ul>
      `
    : '';


  return (
    `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${huminazeDate(dateFrom, DateFormat.MONTH_DAY)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${huminazeDate(dateFrom, DateFormat.HOURS_MINUTES)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${huminazeDate(dateTo, DateFormat.HOURS_MINUTES) }</time>
          </p>
          <p class="event__duration">${getDurationString(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${checkedOffersTemplate}
        <button class="event__favorite-btn ${favoritePoint}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
    `
  );
};

export default class PointView extends AbstractView {
  #point = null;
  #offers = [];
  #destination = null;
  #handleEditButtonClick = null;
  #handleFavoriteButtonClick = null;
  #editButton = null;
  #favoriteButton = null;

  constructor({ point, checkedOffers, destination, handleEditOpenButtonClick, handleFavoriteButtonClick }) {
    super();
    this.#point = point;
    this.#offers = checkedOffers;
    this.#destination = destination;
    this.#handleEditButtonClick = handleEditOpenButtonClick;
    this.#handleFavoriteButtonClick = handleFavoriteButtonClick;

    this.#editButton = this.element.querySelector('.event__rollup-btn');
    this.#favoriteButton = this.element.querySelector('.event__favorite-btn');
    this.#editButton.addEventListener('click', this.#editButtonClickHandler);
    this.#favoriteButton.addEventListener('click', this.#favoriteButtonClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destination);
  }

  disable() {
    this.#editButton.disabled = true;
    this.#favoriteButton.disabled = true;
  }

  enable() {
    this.#editButton.disabled = false;
    this.#favoriteButton.disabled = false;
  }

  #editButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditButtonClick();
  };

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteButtonClick();
  };
}
