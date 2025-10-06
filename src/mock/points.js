import { getRandomInteger, getRandomArrElem} from '../util.js';
import { mockOffers } from './offers.js';
import { mockDestinations } from './destinations.js';

const mockPoints = [
  {
    id: '1',
    basePrice: getRandomInteger(50, 1000),
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: mockDestinations[0].id,
    isFavorite: true,
    type: mockOffers[0].type,
    offers: Array.from({ length: getRandomInteger(0, mockOffers[0].offers.length) }, (_, i) => mockOffers[0].offers[i].id)
  },
  {
    id: '2',
    basePrice: getRandomInteger(50, 1000),
    dateFrom: '2019-07-12T14:05:30.245Z',
    dateTo: '2019-07-12T15:45:12.512Z',
    destination: mockDestinations[1].id,
    isFavorite: true,
    type: mockOffers[1].type,
    offers: Array.from({ length: getRandomInteger(0, mockOffers[1].offers.length) }, (_, i) => mockOffers[1].offers[i].id)
  },
  {
    id: '3',
    basePrice: getRandomInteger(50, 1000),
    dateFrom: '2019-07-13T17:13:28.436Z',
    dateTo: '2019-07-13T19:55:28.103Z',
    destination: mockDestinations[2].id,
    isFavorite: false,
    type: mockOffers[2].type,
    offers: Array.from({ length: getRandomInteger(0, mockOffers[2].offers.length) }, (_, i) => mockOffers[2].offers[i].id)
  },
  {
    id: '4',
    basePrice: getRandomInteger(50, 1000),
    dateFrom: '2019-07-15T08:30:41.753Z',
    dateTo: '2019-07-16T09:42:25.602Z',
    destination: mockDestinations[3].id,
    isFavorite: false,
    type: mockOffers[3].type,
    offers: Array.from({ length: getRandomInteger(0, mockOffers[3].offers.length) }, (_, i) => mockOffers[3].offers[i].id)
  },
  {
    id: '5',
    basePrice: getRandomInteger(50, 1000),
    dateFrom: '2019-07-16T21:03:08.175Z',
    dateTo: '2019-07-17T23:11:16.555Z',
    destination: mockDestinations[4].id,
    isFavorite: true,
    type: mockOffers[4].type,
    offers: Array.from({ length: getRandomInteger(0, mockOffers[4].offers.length) }, (_, i) => mockOffers[4].offers[i].id)
  },
];

const getRandomPoint = () => getRandomArrElem(mockPoints);

export {getRandomPoint};
