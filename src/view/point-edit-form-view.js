import { DateMap, huminazeDate } from '../util.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES, POINT_DESTINATIONS, BLANK_DESTINATION, OffersMap } from '../const.js';

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

const createPointOffers = (pointOffers, checkedOffers) => pointOffers.length
  ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${pointOffers.map((offer) => createPointOffer(offer, checkedOffers)).join('')}
      </div>
    </section>
    `
  : '';


const createPointEditFormTemplate = (data) => {
  const { id, basePrice, dateFrom, dateTo, type, destination } = data;
  const { name, description, pictures } = data.destinationInfo;

  const createPointTypes = () =>
    `
    ${
  POINT_TYPES.map((item) =>
    `<div class="event__type-item">
      <input id="event-type-${item.toLowerCase()}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.toLowerCase()}" ${item.toLowerCase() === type.toLowerCase() ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${item.toLowerCase()}" for="event-type-${item.toLowerCase()}-${id}">${item}</label>
    </div>`).join('')}
    `;

  const createPointDestinations = () =>
    `
    ${POINT_DESTINATIONS.map((item) =>
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

  const createDestinationInfo = () => destination
    ? `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      ${createPointPhotos()}
    </section>
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
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name ? name : ''}" list="destination-list-${id}">
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
          ${createPointOffers(data.offersByType, data.checkedOffers)}

          ${createDestinationInfo()}
        </section>
      </form>
    </li>
    `
  );
};

export default class PointEditFormView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;
  #point = null;
  #pointOffers = null;
  #destination = null;
  #checkedOffers = [];
  #handleEditFormSubmit = null;
  #handleEditCloseButtonClick = null;

  constructor({allOffers, allDestinations, point, offers, checkedOffers, destination, onEditFormSubmit, onEditCloseButtonClick}) {
    super();
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#point = point;
    this.#pointOffers = offers;
    this.#checkedOffers = checkedOffers;
    this.#destination = destination;
    this._setState(PointEditFormView.parsePointToState(point, offers, checkedOffers, destination));
    this.#handleEditFormSubmit = onEditFormSubmit;
    this.#handleEditCloseButtonClick = onEditCloseButtonClick;
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#editFormSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editCloseButtonClickHandler);
    this.element.querySelector('input[name="event-price"]').addEventListener('input', this.#pointPriceInputHandler);
    this.element.querySelectorAll('input[name="event-type"]').forEach((typeInput) => typeInput.addEventListener('change', this.#pointTypeChangeHandler));
    this.element.querySelectorAll('.event__offer-checkbox').forEach((offerInput) => offerInput.addEventListener('change', this.#pointOfferChangeHandler));
    this.element.querySelector('input[name="event-destination"]').addEventListener('change', this.#pointDestinationChangeHandler);
  }

  get template() {
    return createPointEditFormTemplate(this._state);
  }

  reset(point, offers, checkedOffers, destination) {
    this.updateElement(
      PointEditFormView.parsePointToState(point, offers, checkedOffers, destination),
    );
  }

  #editFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormSubmit(PointEditFormView.parseStateToPoint(this._state));
  };

  #editCloseButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.reset(this.#point, this.#pointOffers, this.#checkedOffers, this.#destination);
    this.#handleEditCloseButtonClick();
  };

  #pointPriceInputHandler = (evt) => this._setState({
    basePrice: Number(evt.target.value)
  });

  #pointTypeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offersByType: this.#allOffers.find((offer) => offer.type.toLowerCase() === evt.target.value).offers,
      offers: evt.target.value === this.#point.type.toLowerCase() ? [...this.#point.offers] : [],
      checkedOffers: evt.target.value === this.#point.type.toLowerCase() ? [...this.#checkedOffers] : [],
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    const selectedDestination = this.#allDestinations.find((destination) => destination.name === evt.target.value);
    if (selectedDestination) {
      this.updateElement({
        destination: selectedDestination.id,
        destinationData: {
          name: selectedDestination.name,
          description: selectedDestination.description,
          pictures: selectedDestination.pictures
        }
      });
    } else {
      this.updateElement({
        destination: '',
        destinationData: BLANK_DESTINATION
      });
    }
  };

  #pointOfferChangeHandler = (evt) => {
    const changedOfferTitle = evt.target.nextElementSibling.querySelector('.event__offer-title').textContent;
    const changedOffer = this._state.offersByType.find((offer) => offer.title === changedOfferTitle);

    if (evt.target.checked) {
      this._setState({
        offers: [...this._state.offers, changedOffer.id],
        checkedOffers: [...this._state.checkedOffers, changedOffer]
      });
    } else {
      this._setState({
        offers: this._state.offers.filter((offerId) => offerId !== changedOffer.id),
        checkedOffers: this._state.checkedOffers.filter((offer) => offer.id !== changedOffer.id)
      });
    }
  };

  static parsePointToState(point, offersByType, checkedOffers, destination) {
    return {
      ...point,
      offersByType: offersByType.offers,
      checkedOffers: checkedOffers,
      destinationInfo: {
        ...destination
      }
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.offersByType;
    delete point.checkedOffers;
    delete point.destinationData;

    return point;
  }
}
