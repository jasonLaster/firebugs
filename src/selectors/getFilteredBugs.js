import Fuse from 'fuse.js';
import { isMeta } from '../utils';

function priorityValue(priority) {
  if (priority === 'All') {
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

export function getFilteredBugs(state) {
  const {
    filters: { priority, keyword, search, meta },
    bugs: { bugs, metas },
  } = state;

  let filtered = bugs;

  if (keyword === 'meta') {
    filtered = metas;
  }

  if (keyword === 'first') {
    filtered = filtered.filter(b => b.Keywords.includes('first'));
  }

  if (search !== '') {
    filtered = doSearch(bugs, search);
  }

  if (meta) {
    filtered = filtered.filter(bug => bug.Metas.find(m => m.Alias === meta));
  }

  if (priority === 'All') {
    return filtered;
  }

  return filtered.filter(bug => bug.Priority === priorityValue(priority));
}
