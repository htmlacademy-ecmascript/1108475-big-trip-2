import { render } from './framework/render.js';
import FiltersView from './view/filters-view.js';
import Presenter from './presenter/presenter.js';
import PointsModel from './model/point-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

render(new FiltersView(), filtersContainer);


const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const presenter = new Presenter(tripEventsContainer, pointsModel, offersModel, destinationsModel);
presenter.init();
