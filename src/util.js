import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import duration from 'dayjs/plugin/duration';
import { FilterType, SortingType } from './const.js';

dayjs.extend(isBetween);
dayjs.extend(duration);

const DateMap = new Map([
  ['MonthDay', 'MMM D'],
  ['DayMonthYear', 'DD/MM/YY'],
  ['HoursMinutes', 'HH:mm'],
  ['DayMonthYear HoursMinutes', 'DD/MM/YY HH:mm']
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

const huminazeDate = (date, format) => date ? dayjs(date).format(format) : '';

const areDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB);

const getDateDifferenceString = (totalDays, totalHours, totalMinutes) => {
  if (!totalDays && !totalHours && !totalMinutes) {
    return '';
  }

  const minutes = totalMinutes > 9 ? `${totalMinutes}M` : `0${totalMinutes}M`;

  if (!totalDays && !totalHours) {
    return `${minutes}`;
  }

  const hours = totalHours > 9 ? `${totalHours}H` : `0${totalHours}H`;

  if(!totalDays) {
    return `${hours} ${minutes}`;
  }

  const days = totalDays > 9 ? `${totalDays}D` : `0${totalDays}D`;

  return `${days} ${hours} ${minutes}`;
};

const getDateDifference = (start, end) => {
  const diff = dayjs(end).diff(dayjs(start));
  const totalDays = Math.floor(dayjs.duration(diff).asDays());
  const totalHours = Math.floor(dayjs.duration(diff).asHours()) % 24;
  const totalMinutes = Math.round(dayjs.duration(diff).asMinutes()) % 60;

  return getDateDifferenceString(totalDays, totalHours, totalMinutes);
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const getRandomInteger = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));

const getRandomArrElem = (array) => array[Math.floor(Math.random() * array.length)];

export { isEscapeKey, getRandomArrElem, getRandomInteger, DateMap, FiltersMap, SortingMap, areDatesEqual, getDateDifference, huminazeDate };
