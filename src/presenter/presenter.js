import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { FilterType, SortingType, UserAction, UpdateType } from '../const.js';
import { SortingMap, FiltersMap } from '../util.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import SortingView from '../view/sorting-view.js';
import PointsListView from '../view/points-list-view.js';
import PointsEmptyListView from '../view/points-empty-list-view.js';
import LoadingView from '../view/loading-view.js';
import LoadingFailedView from '../view/loading-failed-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

export default class Presenter {
  #mainContainer = null;
  #pointsContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filtersModel = null;

  #allOffers = null;
  #allDestinations = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #newPointButtonComponent = null;
  #sortComponent = null;
  #pointsListComponent = new PointsListView();
  #pointsEmptyListComponent = null;
  #loadingComponent = new LoadingView();
  #loadingFailedComponent = new LoadingFailedView();
  #sorting = SortingType.DAY;
  #filter = FilterType.EVERYTHING;
  #isLoading = true;

  constructor(mainContainer, pointsContainer, filtersModel, pointsModel) {
    this.#mainContainer = mainContainer;
    this.#pointsContainer = pointsContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filter = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = FiltersMap.get(this.#filter).filterPoints(points);

    switch (this.#sorting) {
      case SortingType.TIME:
        return SortingMap.get(SortingType.TIME)([...filteredPoints]);
      case SortingType.PRICE:
        return SortingMap.get(SortingType.PRICE)([...filteredPoints]);
      default:
        return SortingMap.get(SortingType.DAY)([...filteredPoints]);
    }
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;

    if (!points.length) {
      this.#renderPointsEmptyList();
      return;
    }

    this.#renderSort();

    render(this.#pointsListComponent, this.#pointsContainer);
    this.#renderPoints(points);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSorting: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#allOffers = this.#pointsModel.offers;
        this.#allDestinations = this.#pointsModel.destinations;
        remove(this.#loadingComponent);
        this.#newPointButtonComponent = new NewPointButtonView(this.#handleNewPointButtonClick);
        this.#newPointPresenter = new NewPointPresenter(this.#pointsListComponent, this.#handleViewAction, this.#handleNewPointClose, this.#pointsModel, this.#allOffers, this.#allDestinations);
        render(this.#newPointButtonComponent, this.#mainContainer);
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        replace(this.#loadingFailedComponent, this.#loadingComponent);
    }
  };

  #handleNewPointButtonClick = () => {
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (!this.points.length) {
      replace(this.#pointsListComponent, this.#pointsEmptyListComponent);
    }
    this.#newPointPresenter.init();
  };

  #handleNewPointClose = () => {
    this.#newPointButtonComponent.enable();
    if (!this.points.length) {
      replace(this.#pointsEmptyListComponent, this.#pointsListComponent);
    }
  };

  #onSortingChange = (sortingType) => {
    this.#sorting = sortingType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #resetPointsEditing = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetEditing());
  };

  #renderSort() {
    this.#sortComponent = new SortingView(this.#onSortingChange, this.#sorting);
    render(this.#sortComponent, this.#pointsContainer, RenderPosition.AFTERBEGIN);
  }


  #renderPointsEmptyList() {
    this.#pointsEmptyListComponent = new PointsEmptyListView(this.#filter);
    render(this.#pointsEmptyListComponent, this.#pointsContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#pointsContainer, RenderPosition.AFTERBEGIN);
  }

  #clearBoard({ resetSorting = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.clear());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#pointsEmptyListComponent);
    remove(this.#loadingComponent);

    if (!this.points.length) {
      remove(this.#pointsListComponent);
    }

    if (resetSorting) {
      this.#sorting = SortingType.DAY;
    }
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {

    const pointPresenter = new PointPresenter(this.#pointsListComponent.element, this.#handleViewAction, this.#resetPointsEditing, this.#allOffers, this.#allDestinations);

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
