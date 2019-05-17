import Fuse from 'fuse.js';
import { isMeta, sortByPriority, isIntermittent } from '../utils';
import { mapValues, groupBy, sortBy, orderBy } from 'lodash';
import moment from 'moment';
function priorityValue(priority) {
  if (!priority) {
    return null;
  }

  if (priority === 'None') {
    return ' --';
  }

  return priority;
}

function doSearch(results, search) {
  const fuse = new Fuse(results, {
    keys: [{ name: 'Summary' }],
    tokenize: true,
    matchAllTokens: true,
    threshold: 0.2,
    shouldSort: true,
  });
  return fuse.search(search.trim());
}

function filterBugs(state, filtered) {
  const {
    filters: { priority, keyword, search, meta, page, type, changed },
    bugs: { metas, intermittents },
  } = state;

  // filtered = filtered.filter(b => b.Changed.includes('2018'));

  if (page === 'releases') {
    filtered = filtered.filter(b => b.Whiteboard.includes('debugger-mvp'));
  }

  if (page === 'intermittents') {
    filtered = filtered.filter(b => isIntermittent(b));
  }

  if (keyword != 'meta') {
    filtered = filtered.filter(b => !isMeta(b));
  }

  if (keyword != 'intermittent-failure' && page !== 'intermittents') {
    filtered = filtered.filter(b => !isIntermittent(b));
  }

  if (keyword) {
    filtered = filtered.filter(b => b.Keywords.includes(keyword));
  }

  if (search !== '') {
    filtered = doSearch(filtered, search);
  }

  if (changed) {
    const map = {
      today: moment().subtract(1, 'days'),
      week: moment().subtract(7, 'days'),
      month: moment().subtract(1, 'months'),
      stale: moment().subtract(6, 'months'),
    };
    if (changed == 'stale') {
      filtered = filtered.filter(b => moment(b.Changed) < map.stale);
    } else {
      filtered = filtered.filter(b => moment(b.Changed) > map[changed]);
    }
  }

  if (meta) {
    if (meta === 'none') {
      filtered = filtered.filter(bug => bug.Metas.length == 0);
    } else {
      filtered = filtered.filter(bug => bug.Metas.find(m => m.Alias === meta));
    }
  }

  if (type) {
    filtered = filtered.filter(bug => bug.Type == type);
  }

  if (!priority) {
    return filtered;
  }

  return filtered.filter(bug => bug.Priority === priorityValue(priority));
}

// Sort by priority and then by first meta
function sortBugs(state, bugs) {
  if (state.filters.sortBy) {
    return orderBy(bugs, b => b.Changed, ['desc']);
  }

  if (state.filters.keyword == 'meta') {
    return orderBy(bugs, b => b.metaCount, ['desc']);
  }

  if (state.filters.page == 'intermittents') {
    return orderBy(bugs, b => b.failCount, ['desc']);
  }

  const ps = mapValues(groupBy(bugs, bug => bug.Priority), bs =>
    sortBy(bs, [
      b => b.Metas.map(m => m.Alias || `x${m.BugID}`)[0],
      b => b.Assignee,
    ])
  );
  return [].concat(ps.P1, ps.P2, ps.P3, ps.P4, ps.P5, ps[' --']).filter(i => i);
}

function formatBugs(state) {
  const {
    bugs: { bugs, intermittents },
  } = state;

  let filtered = [];
  for (const bug of bugs) {
    const failCount = intermittents[bug.BugID] || 0;

    const metaCount = isMeta(bug)
      ? bugs.filter(b => b.Metas.map(m => +m.BugID).includes(+bug.BugID)).length
      : 0;

    filtered.push({ ...bug, failCount, metaCount });
  }

  return filtered;
}

export function getFilteredBugs(state) {
  let filtered = formatBugs(state);
  filtered = filterBugs(state, filtered);
  filtered = sortBugs(state, filtered);
  window.filtered = filtered;
  return filtered;
}
