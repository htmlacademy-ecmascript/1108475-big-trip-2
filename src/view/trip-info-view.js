import AbstractView from '../framework/view/abstract-view.js';
import { DateFormat } from '../const.js';
import { huminazeDate } from '../util.js';


const createTripInfoTemplate = (points, tripTotalCost, tripDestinations) => {
  const {firstPoint, lastPoint} = points;

  const { firstDestination, secondDestination, thirdDestination, lastDestination, destinations } = tripDestinations;

  const createTripDestinationsTemplate = () => {

    switch (destinations.length) {
      case 1:
        return `${firstDestination}`;
      case 2:
        if (firstDestination === lastDestination) {
          return `${firstDestination} &mdash; ${secondDestination} &mdash; ${lastDestination}`;
        } else {
          return `${firstDestination} &mdash; ${lastDestination}`;
        }
      case 3:
        if (firstDestination === lastDestination || secondDestination === lastDestination) {
          return `${firstDestination} &mdash; ${secondDestination} &mdash; ${thirdDestination} &mdash; ${lastDestination}`;
        } else {
          return `${firstDestination} &mdash; ${secondDestination} &mdash; ${lastDestination}`;
        }
      default:
        return `${firstDestination} &mdash; ... &mdash; ${lastDestination}`;
    }
  };

  return (
    `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${createTripDestinationsTemplate()}</h1>
        <p class="trip-info__dates">${huminazeDate(firstPoint.dateFrom, DateFormat.DAY_MONTH)} &nbsp;&mdash;&nbsp;${huminazeDate(lastPoint.dateTo, DateFormat.DAY_MONTH)}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripTotalCost}</span>
      </p>
    </section>
  `
  );
};

export default class TripInfoView extends AbstractView {
  #points = null;
  #tripTotalCost = null;
  #tripDestinations = null;

  constructor({tripTotalCost, tripDestinations, ...points}) {
    super();
    this.#points = points;
    this.#tripTotalCost = tripTotalCost;
    this.#tripDestinations = tripDestinations;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#tripTotalCost, this.#tripDestinations);
  }
}
