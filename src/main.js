import { render } from './framework/render.js';
import { generateFilters } from './mock/filters.js';
import FiltersView from './view/filters-view.js';
import Presenter from './presenter/presenter.js';
import PointsModel from './model/point-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const filters = generateFilters(pointsModel.points);

render(new FiltersView(filters), filtersContainer);


const presenter = new Presenter(tripEventsContainer, pointsModel, offersModel, destinationsModel);
presenter.init();
