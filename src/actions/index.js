import { debounce } from 'lodash';
import { getIntermittents } from '../reducers/bugs';
import { getBugs } from '../utils/fetchBugs';

export function setPriority(priority) {
  return setFilter({ priority });
}

export function setKeyword(keyword) {
  return setFilter({ keyword });
}

export function setType(type) {
  return setFilter({ type });
}

export function setWhiteboard(whiteboard) {
  return setFilter({ whiteboard });
}

export function setSortBy(sortBy) {
  return function(dispatch, getState) {
    if (getState().filters.sortBy == sortBy) {
      sortBy = null;
    }

    dispatch(setFilter({ sortBy }));
  };
}

export function setMeta(meta) {
  return function(dispatch, getState) {
    if (getState().filters.meta == meta) {
      meta = null;
    }

    dispatch(setFilter({ meta }));
  };
}

const debouncedSearch = debounce(search => setFilter({ search }), 100);

export function setSearch(search) {
  return setFilter({ search });
}

export function setChanged(changed) {
  return setFilter({ changed });
}

export function setFilter(value) {
  return { type: 'SET_FILTER', value };
}

export function fetchBugs() {
  return async function(dispatch, getState) {
    const { product, component } = getState().filters;
    const { bugs, metas, fetched } = await getBugs(product, component);
    dispatch(updateResults({ bugs, metas }));

    const res = await fetched;
    dispatch(updateResults(res));
    dispatch(fetchIntermittents());
  };
}

function updateResults(value) {
  return { type: 'SET_RESULTS', value };
}

export function setPage(page) {
  return async function(dispatch, getState) {
    dispatch({ type: 'SET_PAGE', page });
  };
}

export function fetchIntermittents() {
  return async function(dispatch, getState) {
    const intermittents = getIntermittents(getState());
    const ids = intermittents.map(i => i.BugID).join(',');
    const results = await (await fetch(
      `.netlify/functions/intermittents?bugs=${ids}`
    )).json();

    localStorage.setItem('intermittents', JSON.stringify(results));
    dispatch({ type: 'SET_INTERMITTENTS', value: { intermittents: results } });
  };
}
