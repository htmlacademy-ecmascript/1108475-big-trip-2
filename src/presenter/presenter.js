import { render } from '../framework/render.js';
import { FilterType, SortingType } from '../const.js';
import { SortingMap } from '../util.js';
import SortingView from '../view/sorting-view.js';
import PointsListView from '../view/points-list-view.js';
import PointsEmptyListView from '../view/points-empty-list-view.js';
import PointPresenter from './point-presenter.js';

export default class Presenter {
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #boardPoints = [];
  #points = [];
  #allOffers = null;
  #allDestinations = null;
  #pointPresenters = new Map();
  #sortComponent = null;
  #pointsListComponent = null;
  #sorting = SortingType.DAY;

  constructor(container, pointsModel, offersModel, destinationsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#points = this.#boardPoints.slice();

    this.#allOffers = [...this.#offersModel.offers];
    this.#allDestinations = [...this.#destinationsModel.destinations];

    this.#renderBoard();
  }

  #renderBoard() {

    if (!this.#boardPoints.length) {
      render(new PointsEmptyListView(FilterType.EVERYTHING), this.#container);
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints(SortingMap.get(this.#sorting)(this.#points));
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = this.#boardPoints.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
    this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
    this.#pointPresenters.get(updatedPoint.id).init({
      point: updatedPoint,
      offers: this.#offersModel.getOffersByType(updatedPoint.type),
      checkedOffers: [...this.#offersModel.getOffersById(updatedPoint.type, updatedPoint.offers)],
      destination: this.#destinationsModel.getDestinationById(updatedPoint.destination)
    });
  };

  #onSortingChange = (sortingType) => {
    this.#sorting = sortingType;
    this.#sortPoints();
  };

  #sortPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.clear());
    this.#pointPresenters.clear();
    this.#renderPoints(SortingMap.get(this.#sorting)(this.#points));
  };

  #resetPointsEditing = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetEditing());
  };

  #renderSort() {
    this.#sortComponent = new SortingView(this.#onSortingChange);
    render(this.#sortComponent, this.#container);
  }

  #renderPointsList() {
    this.#pointsListComponent = new PointsListView();
    render(this.#pointsListComponent, this.#container);
  }

  #renderPoints = (points) => {
    for (let i = 0; i < points.length; i++) {
      this.#renderPoint({
        point: points[i],
        offers: this.#offersModel.getOffersByType(points[i].type),
        checkedOffers: [...this.#offersModel.getOffersById(points[i].type, points[i].offers)],
        destination: this.#destinationsModel.getDestinationById(points[i].destination)
      });
    }
  };

  #renderPoint({point, offers, checkedOffers, destination}) {

    const pointPresenter = new PointPresenter(this.#pointsListComponent.element, this.#handlePointChange, this.#resetPointsEditing, this.#sortPoints, this.#allOffers, this.#allDestinations);

    pointPresenter.init({point, offers, checkedOffers, destination});
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
