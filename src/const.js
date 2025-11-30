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

const DateFormat = {
  DAY: 'D',
  DAY_MONTH: 'D MMM',
  MONTH_DAY: 'MMM D',
  HOURS_MINUTES: 'HH:mm',
  DAY_MONTH_YEAR_HOURS_MINUTES: 'DD/MM/YY HH:mm'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const FilterEmptyMap = new Map([
  [FilterType.EVERYTHING, 'Click New Event to create your first point'],
  [FilterType.FUTURE, 'There are no future events now'],
  [FilterType.PRESENT, 'There are no present events now'],
  [FilterType.PAST, 'There are no past events now'],
]);

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
  LOWER_LIMIT: 150,
  UPPER_LIMIT: 1000,
};

const ESCAPE_KEY = 'Escape';

const AUTHORIZATION = 'Basic b8s72e4kt35wg9f';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

export { BLANK_POINT, BLANK_DESTINATION, DateFormat, FilterType, FilterEmptyMap, SortingType, UserAction, UpdateType, Method, BlockerTimeLimit, ESCAPE_KEY, AUTHORIZATION, END_POINT };
