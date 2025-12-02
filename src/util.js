import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import duration from 'dayjs/plugin/duration';
import { FilterType, SortingType, ESCAPE_KEY } from './const.js';

dayjs.extend(isBetween);
dayjs.extend(duration);

const filterData = (filterType, points) => {
  switch (filterType) {
    case FilterType.FUTURE:
      return points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs()));
    case FilterType.PRESENT:
      return points.filter((point) => dayjs().isBetween(point.dateFrom, point.dateTo, null, []));
    case FilterType.PAST:
      return points.filter((point) => dayjs(point.dateTo).isBefore(dayjs()));
    default:
      return points;
  }
};

const sortData = (sortingType, points) => {
  switch (sortingType) {
    case SortingType.DAY:
      return points.sort((point, nextPoint) => dayjs(point.dateFrom) - dayjs(nextPoint.dateFrom));
    case SortingType.TIME:
      return points.sort((point, nextPoint) => (dayjs(nextPoint.dateTo).diff(dayjs(nextPoint.dateFrom))) - (dayjs(point.dateTo).diff(dayjs(point.dateFrom))));
    case SortingType.PRICE:
      return points.sort((point, nextPoint) => nextPoint.basePrice - point.basePrice);
  }
};

const huminazeDate = (date, format) => date ? dayjs(date).format(format) : '';

const areDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB);

const getDurationString = (start, end) => {
  const diff = dayjs(end).diff(dayjs(start));
  const totalDays = Math.floor(dayjs.duration(diff).asDays());
  const totalHours = Math.floor(dayjs.duration(diff).asHours()) % 24;
  const totalMinutes = Math.round(dayjs.duration(diff).asMinutes()) % 60;

  if (!totalDays && !totalHours && !totalMinutes) {
    return '';
  }

  const minutes = totalMinutes < 10 ? `0${totalMinutes}M` : `${totalMinutes}M`;

  if (!totalDays && !totalHours) {
    return `${minutes}`;
  }

  const hours = totalHours < 10 ? `0${totalHours}H` : `${totalHours}H`;

  if(!totalDays) {
    return `${hours} ${minutes}`;
  }

  const days = totalDays < 10 ? `0${totalDays}D` : `${totalDays}D`;

  return `${days} ${hours} ${minutes}`;
};

const isEscapeKey = (evt) => evt.key === ESCAPE_KEY;

export { isEscapeKey, filterData, sortData, areDatesEqual, getDurationString, huminazeDate };
