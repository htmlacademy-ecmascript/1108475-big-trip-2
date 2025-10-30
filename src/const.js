const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const POINT_DESTINATIONS = ['Amsterdam', 'Chamonix', 'Geneva', 'Paris', 'Berlin', 'Brussels'];

const POINT_OFFERS = ['Add luggage', 'Switch to comfort', 'Add meal', 'Choose seats', 'Travel by train'];

const BLANK_DESTINATION = {
  id: '',
  name: '',
  description: '',
  pictures: []
};

const OffersMap = new Map([
  ['Add luggage', 'luggage'],
  ['Switch to comfort', 'comfort'],
  ['Add meal', 'meal'],
  ['Choose seats', 'seats'],
  ['Travel by train', 'train'],
]);

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

const POINT_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

export { POINT_TYPES, POINT_DESTINATIONS, POINT_OFFERS, POINT_DESCRIPTIONS, BLANK_DESTINATION, OffersMap, FilterType, SortingType };
