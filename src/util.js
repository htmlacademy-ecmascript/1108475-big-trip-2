import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import { FilterType, SortingType } from './const.js';

dayjs.extend(utc);
dayjs.extend(isBetween);

const DateMap = new Map([
  ['MonthDay', 'MMM D'],
  ['DayMonthYear', 'DD/MM/YY'],
  ['HoursMinutes', 'HH:mm']
]);

const FiltersMap = new Map([
  [FilterType.EVERYTHING, {
    filterPoints: (points) => points,
    empty: 'Click New Event to create your first point',
  }],
  [FilterType.FUTURE, {
    filterPoints: (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs())),
    empty: 'There are no future events now',
  }],
  [FilterType.PRESENT, {
    filterPoints: (points) => points.filter((point) => dayjs().isBetween(point.dateFrom, point.dateTo, null, [])),
    empty: 'There are no present events now',
  }],
  [FilterType.PAST, {
    filterPoints: (points) => points.filter((point) => dayjs(point.dateTo).isBefore(dayjs())),
    empty: 'There are no past events now',
  }]
]);

const SortingMap = new Map([
  [SortingType.DAY,
    (points) => points.sort((point, nextPoint) => dayjs(point.dateFrom) - dayjs(nextPoint.dateFrom))],
  [SortingType.TIME,
    (points) => points.sort((point, nextPoint) => (dayjs(nextPoint.dateTo).diff(dayjs(nextPoint.dateFrom))) - (dayjs(point.dateTo).diff(dayjs(point.dateFrom))))],
  [SortingType.PRICE,
    (points) => points.sort((point, nextPoint) => nextPoint.basePrice - point.basePrice)],
]);

const huminazeDate = (date, format) => date ? dayjs(date).utc().format(format) : '';
const getDateDifference = (start, end) => {
  const diff = new Date(end) - new Date(start);
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const totalMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (totalDays > 0) {

    return `${totalDays}D ${totalHours}H ${totalMinutes}M`;
  }

  if (totalHours > 0) {
    return `${totalHours}H ${totalMinutes}M`;
  }
  return `${totalMinutes}M`;
};

const getRandomInteger = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));

const getRandomArrElem = (array) => array[Math.floor(Math.random() * array.length)];

export { getRandomArrElem, getRandomInteger, DateMap, FiltersMap, SortingMap, getDateDifference, huminazeDate };
