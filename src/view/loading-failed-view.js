import AbstractView from '../framework/view/abstract-view.js';


const createLoadingFailedTemplate = () =>
  `
  <p class="trip-events__msg">Failed to load latest route information</p>
  `;

export default class LoadingFailedView extends AbstractView {

  constructor() {
    super();
  }

  get template() {
    return createLoadingFailedTemplate();
  }
}
