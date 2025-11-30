import AbstractView from '../framework/view/abstract-view.js';


const createNewPointButtonTemplate = () =>
  `
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
  `;

export default class NewPointButtonView extends AbstractView {
  #handleNewPointButtonClick = null;

  constructor(handleNewPointButtonClick) {
    super();
    this.#handleNewPointButtonClick = handleNewPointButtonClick;
    this.element.addEventListener('click', this.#newPointButtonClickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  enable() {
    this.element.disabled = false;
  }

  #newPointButtonClickHandler = () => {
    this.element.disabled = true;
    this.#handleNewPointButtonClick();
  };
}
