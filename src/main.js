import { render } from '../src/render.js';
import FiltersView from './view/filters-view.js';
import Presenter from './presenter/presenter.js';
import PointsModel from './model/point-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

render(new FiltersView(), filtersContainer);

const pointsModel = new PointsModel();

const presenter = new Presenter(tripEventsContainer, pointsModel);
presenter.init();
