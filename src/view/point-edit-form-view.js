import he from 'he';
import { DateFormat } from '../const.js';
import { huminazeDate } from '../util.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createPointEditFormTemplate = (data, allOffers, allDestinations) => {
  const { id, basePrice, dateFrom, dateTo, type, offersByType, checkedOffers } = data;
  const { name, description, pictures } = data.destinationInfo;
  const { isDisabled, isSaving, isDeleting } = data.formState;
  const offersTypes = allOffers.map((item) => item.type);
  const destinationsNames = allDestinations.map((item) => item.name);

  const isNewPoint = id
    ? `
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
    `
    : '<button class="event__reset-btn" type="reset">Cancel</button>';

  const createPointTypesTemplate = () =>
    `
    ${
  offersTypes.map((item) =>
    `<div class="event__type-item">
      <input id="event-type-${item}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}" ${item === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-${id}">${item}</label>
    </div>`).join('')}
    `;

  const createPointDestinationsTemplate = () =>
    `
    ${destinationsNames.map((item) =>
    `
    <option value="${item}"></option>`).join('')}
    `;

  const createPointPhotosTemplate = () => pictures.length
    ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
        </div>
      </div>
      `
    : '';

  const createDestinationInfoTemplate = () => description || pictures.length
    ? `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${description ? `<p class="event__destination-description">${description}</p>` : ''}

      ${createPointPhotosTemplate()}
    </section>
    `
    : '';

  const createPointOfferTemplate = (offer) => {
    const { id: offerId, title, price } = offer;
    const isOfferChecked = checkedOffers.map((item) => item.id).includes(offerId) ? 'checked' : '';
    const titleLastWord = title.split(' ').pop();

    return (
      `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${titleLastWord}-${offerId}" type="checkbox" name="event-offer-${titleLastWord}" ${isOfferChecked} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${titleLastWord}-${offerId}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>
      `
    );
  };

  const createPointOffersTemplate = () => offersByType.length
    ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${offersByType.map((offer) => createPointOfferTemplate(offer, checkedOffers)).join('')}
      </div>
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
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${createPointTypesTemplate()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(name)}" list="destination-list-${id}" autocomplete="off" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-${id}">
              ${createPointDestinationsTemplate()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${huminazeDate(dateFrom, DateFormat.DAY_MONTH_YEAR_HOURS_MINUTES)}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${huminazeDate(dateTo, DateFormat.DAY_MONTH_YEAR_HOURS_MINUTES)}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="number" min="0" max="10000" name="event-price" value="${basePrice}" autocomplete="off" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          ${isNewPoint}
        </header>
        <section class="event__details">
          ${createPointOffersTemplate()}

          ${createDestinationInfoTemplate()}
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
  #handleEditDeleteButtonClick = null;
  #dateFromPicker = null;
  #dateToPicker = null;

  constructor({ allOffers, allDestinations, point, offers, checkedOffers, destination, handleEditFormSubmit, handleEditCloseButtonClick, handleEditDeleteButtonClick}) {
    super();
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#point = point;
    this.#pointOffers = offers;
    this.#checkedOffers = checkedOffers;
    this.#destination = destination;
    this._setState(PointEditFormView.parsePointToState(point, offers, checkedOffers, destination));
    this.#handleEditFormSubmit = handleEditFormSubmit;
    this.#handleEditCloseButtonClick = handleEditCloseButtonClick;
    this.#handleEditDeleteButtonClick = handleEditDeleteButtonClick;
    this._restoreHandlers();
  }

  get template() {
    return createPointEditFormTemplate(this._state, this.#allOffers, this.#allDestinations);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#editFormSubmitHandler);
    this.element.querySelector('input[name="event-price"]').addEventListener('input', this.#pointPriceInputHandler);
    this.element.querySelectorAll('input[name="event-type"]').forEach((typeInput) => typeInput.addEventListener('change', this.#pointTypeChangeHandler));
    this.element.querySelectorAll('.event__offer-checkbox').forEach((offerInput) => offerInput.addEventListener('change', this.#pointOfferChangeHandler));
    this.element.querySelector('input[name="event-destination"]').addEventListener('change', this.#pointDestinationChangeHandler);
    this.#setDatepickers();

    if (this.#point.id) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editCloseButtonClickHandler);
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#editDeleteButtonClickHandler);
    } else {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#editCloseButtonClickHandler);
    }
  }

  removeElement() {
    super.removeElement();

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }

    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  }

  reset() {
    this.updateElement(PointEditFormView.parsePointToState(this.#point, this.#pointOffers, this.#checkedOffers, this.#destination));
  }

  #setDatepickers() {
    this.#dateFromPicker = flatpickr(
      this.element.querySelector('input[name="event-start-time"]'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler,
      },
    );
    this.#dateToPicker = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
      },
    );
  }

  #editFormSubmitHandler = (evt) => {
    evt.preventDefault();
    if (
      !this._state.destination ||
      !this.#dateFromPicker.input.value ||
      !this.#dateToPicker.input.value ||
      !this._state.basePrice
    ) {
      this.shake();
    } else {
      this.#handleEditFormSubmit(PointEditFormView.parseStateToPoint(this._state));
    }
  };

  #editCloseButtonClickHandler = () => {
    if(this.element.parentElement) {
      this.#handleEditCloseButtonClick();
    }
  };

  #editDeleteButtonClickHandler = () => {
    this.#handleEditDeleteButtonClick(PointEditFormView.parseStateToPoint(this._state));
  };

  #pointPriceInputHandler = (evt) => this._setState({
    basePrice: Number(evt.target.value)
  });

  #pointTypeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offersByType: this.#allOffers.find((offer) => offer.type === evt.target.value).offers,
      offers: evt.target.value === this.#point.type ? [...this.#point.offers] : [],
      checkedOffers: evt.target.value === this.#point.type ? [...this.#checkedOffers] : [],
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    const selectedDestination = this.#allDestinations.find((destination) => destination.name === evt.target.value);
    if (selectedDestination) {
      this.updateElement({
        destination: selectedDestination.id,
        destinationInfo: {
          name: selectedDestination.name,
          description: selectedDestination.description,
          pictures: selectedDestination.pictures
        }
      });
    } else {
      evt.target.value = this._state.destinationInfo.name;
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

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#dateToPicker.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  static parsePointToState(point, offersByType, checkedOffers, destination) {
    return {
      ...point,
      offersByType: offersByType,
      checkedOffers: checkedOffers,
      destinationInfo: {
        ...destination
      },
      formState: {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      }
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.offersByType;
    delete point.checkedOffers;
    delete point.destinationInfo;
    delete point.formState;

    return point;
  }
}
