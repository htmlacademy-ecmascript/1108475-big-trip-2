import { render } from '../framework/render.js';
import { FilterType } from '../const.js';
import SortingView from '../view/sorting-view.js';
import PointsListView from '../view/points-list-view.js';
import PointsEmptyListView from '../view/points-empty-list-view.js';
import PointPresenter from './point-presenter.js';

export default class Presenter {
  #sortingComponent = new SortingView();
  #pointsListComponent = new PointsListView();
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #points = [];
  #pointPresenters = new Map();

  constructor(container, pointsModel, offersModel, destinationsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #renderBoard() {

    if(!this.#points.length) {
      render(new PointsEmptyListView(FilterType.EVERYTHING), this.#container);
      return;
    }

    render(this.#sortingComponent, this.#container);
    render(this.#pointsListComponent, this.#container);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint({
        point: this.#points[i],
        offers: this.#offersModel.getOffersByType(this.#points[i].type),
        checkedOffers: [...this.#offersModel.getOffersById(this.#points[i].type, this.#points[i].offers)],
        destination: this.#destinationsModel.getDestinationById(this.#points[i].destination)
      });
    }
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #resetPointsEditing = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetEditing());
  };

  #renderPoint({point, offers, checkedOffers, destination}) {

    const pointPresenter = new PointPresenter(this.#pointsListComponent.element, this.#handlePointChange, this.#resetPointsEditing, offers, checkedOffers, destination);

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
