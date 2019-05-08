import { sortBy } from 'lodash';

export function sortByPriority(bugs) {
  return sortBy(bugs, bug =>
    bug.Priority.match(/\d/) ? +bug.Priority.match(/\d/)[0] : 10
  );
}

export function isMeta(bug) {
  return bug.Keywords.includes('meta');
}
