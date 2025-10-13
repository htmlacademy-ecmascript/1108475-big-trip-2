import { DateMap, huminazeDate } from '../util.js';
import AbstractView from '../framework/view/abstract-view.js';
import { POINT_TYPES, POINT_DESTINATIONS, OffersMap } from '../const.js';

const createPointOffer = (offer, checkedOffers) => {
  const { id: offerId, title, price } = offer;
  const isOfferChecked = checkedOffers.map((item) => item.id).includes(offerId) ? 'checked' : '';

  return (
    `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${OffersMap.get(title)}-${offerId}" type="checkbox" name="event-offer-${OffersMap.get(title)}" ${isOfferChecked}>
        <label class="event__offer-label" for="event-offer-${OffersMap.get(title)}-${offerId}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>
      `
  );
};

const createPointOffers = (pointOffers, checkedOffers) => pointOffers.offers.length
  ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${pointOffers.offers.map((offer) => createPointOffer(offer, checkedOffers)).join('')}
      </div>
    </section>
    `
  : '';


const createPointEditFormTemplate = (point, pointOffers, checkedOffers, destination) => {
  const {id, type, basePrice, dateFrom, dateTo} = point;
  const {name, description, pictures} = destination;

  const createPointTypes = () =>
    `
    ${
  POINT_TYPES.map((item) =>
    `<div class="event__type-item">
      <input id="event-type-${item.toLowerCase()}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.toLowerCase()}" ${item === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${item.toLowerCase()}" for="event-type-${item.toLowerCase()}-${id}">${item}</label>
    </div>`).join('')}
    `;

  const createPointDestinations = () =>
    `
    ${
  POINT_DESTINATIONS.map((item) =>
    `
    <option value="${item}"></option>`).join('')}
    `;

  const createPointPhotos = () => pictures.length
    ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
        </div>
      </div>
      `
    : '';

  return (
    `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${createPointTypes()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${createPointDestinations()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${huminazeDate(dateFrom, DateMap.get('DayMonthYear'))} ${huminazeDate(dateFrom, DateMap.get('HoursMinutes'))}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${huminazeDate(dateTo, DateMap.get('DayMonthYear'))} ${huminazeDate(dateTo, DateMap.get('HoursMinutes'))}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createPointOffers(pointOffers, checkedOffers)}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            ${createPointPhotos()}
          </section>
        </section>
      </form>
    </li>
    `
  );
};

export default class PointEditFormView extends AbstractView {
  #point = null;
  #offers = null;
  #destination = null;
  #checkedOffers = [];
  #handleEditFormSubmit = null;
  #handleEditCloseButtonClick = null;
  #editForm = null;

  constructor({point, offers, checkedOffers, destination, onEditFormSubmit, onEditCloseButtonClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#checkedOffers = checkedOffers;
    this.#destination = destination;
    this.#handleEditFormSubmit = onEditFormSubmit;
    this.#handleEditCloseButtonClick = onEditCloseButtonClick;

    this.#editForm = this.element.querySelector('form');
    this.#editForm.addEventListener('submit', this.#editFormSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editCloseButtonClickHandler);
  }

  get template() {
    return createPointEditFormTemplate(this.#point, this.#offers, this.#checkedOffers, this.#destination);
  }

  resetForm = () => this.#editForm.reset();

  #editFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormSubmit();
  };

  #editCloseButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.resetForm();
    this.#handleEditCloseButtonClick();
  };
}
