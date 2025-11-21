import Presenter from './presenter/presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './api/points-api-service.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const mainContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const filtersModel = new FilterModel();

const filterPresenter = new FilterPresenter(filtersContainer, filtersModel, pointsModel);
const presenter = new Presenter(mainContainer, tripEventsContainer, filtersModel, pointsModel);

pointsModel.init();
filterPresenter.init();
presenter.init();
