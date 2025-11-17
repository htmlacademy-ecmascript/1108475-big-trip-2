import Presenter from './presenter/presenter.js';
import PointsModel from './model/point-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const mainContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filtersModel = new FilterModel();

const filterPresenter = new FilterPresenter(filtersContainer, filtersModel, pointsModel);
const presenter = new Presenter(mainContainer, tripEventsContainer, filtersModel, pointsModel, offersModel, destinationsModel);

filterPresenter.init();
presenter.init();
