const BLANK_POINT = {
  id: '',
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  type: 'flight',
  offers: []
};

const BLANK_DESTINATION = {
  id: '',
  name: '',
  description: '',
  pictures: []
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortingType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const BlockerTimeLimit = {
  LOWER_LIMIT: 250,
  UPPER_LIMIT: 1000,
};

const AUTHORIZATION = 'Basic b8s72e4kt35wg9f';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

export { BLANK_POINT, BLANK_DESTINATION, FilterType, SortingType, UserAction, UpdateType, Method, BlockerTimeLimit, AUTHORIZATION, END_POINT };
