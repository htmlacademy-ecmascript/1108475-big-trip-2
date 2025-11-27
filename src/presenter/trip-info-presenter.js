import { render, replace, remove, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import { SortingMap } from '../util.js';
import { SortingType } from '../const.js';

export default class TripInfoPresenter {
  #mainContainer = null;
  #tripInfoComponent = null;
  #pointsModel = null;
  #points = null;
  #offers = null;
  #destinations = null;


  constructor(mainContainer, pointsModel) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);

  }

  get points() {
    return SortingMap.get(SortingType.DAY)([...this.#pointsModel.points]);
  }

  get offers() {
    return this.#pointsModel.offers.flatMap((item) => item.offers);
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#points = this.points;

    if (this.#points.length) {
      this.#offers = this.offers;
      this.#destinations = this.destinations;

      const previousTripInfoComponent = this.#tripInfoComponent;
      this.#tripInfoComponent = new TripInfoView(
        {
          tripTotalCost: this.#getTripTotalCost(),
          tripDestinations: this.#getTripDestinations(),
          firstPoint: this.#points[0],
          lastPoint: this.#points[this.#points.length - 1],
        }
      );

      if (previousTripInfoComponent === null) {
        render(this.#tripInfoComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
        return;
      }

      replace(this.#tripInfoComponent, previousTripInfoComponent);
      remove(previousTripInfoComponent);
    } else {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
    }
  }

  #getTripTotalCost = () => {
    const basePricesTotal = this.#points.reduce((prevPrice, point) => prevPrice + point.basePrice, 0);

    const offersIds = this.#points.flatMap((point) => point.offers);
    const offersPrices = offersIds.map((id) => this.#offers.find((item) => item.id === id).price);
    const offersPricesTotal = offersPrices.reduce((prevPrice, price) => prevPrice + price);

    return basePricesTotal + offersPricesTotal;
  };

  #getTripDestinations = () => {
    const tripDestinationsIds = this.#points.map((point) => point.destination);
    const destinationsIds = [...new Set(tripDestinationsIds)];
    return {
      firstDestination: this.#destinations.find((item) => item.id === tripDestinationsIds[0]).name,
      secondDestination: destinationsIds.length >= 2 ? this.#destinations.find((item) => item.id === destinationsIds[1]).name : null,
      thirdDestination: destinationsIds.length === 3 ? this.#destinations.find((item) => item.id === destinationsIds[2]).name : null,
      lastDestination: this.#destinations.find((item) => item.id === tripDestinationsIds[tripDestinationsIds.length - 1]).name,
      destinations: destinationsIds
    };
  };

  #handleModelEvent = () => this.init();
}
