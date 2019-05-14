import { sortBy } from 'lodash';

export function sortByPriority(bugs) {
  return sortBy(bugs, bug =>
    bug.Priority.match(/\d/) ? +bug.Priority.match(/\d/)[0] : 10
  );
}

export function isMeta(bug) {
  return bug.Keywords.includes('meta');
}

export function isIntermittent(bug) {
  return bug.Keywords.includes('intermittent');
}
