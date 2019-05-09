import { debounce } from 'lodash';
import { getBugs } from '../utils/fetchBugs';

export function setPriority(priority) {
  return setFilter({ priority });
}

export function setKeyword(keyword) {
  return setFilter({ keyword });
}

export function setMeta(meta) {
  return async function(dispatch, getState) {
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

function setFilter(value) {
  return { type: 'SET_FILTER', value };
}

export function fetchBugs() {
  return async function(dispatch) {
    const { bugs, metas, fetched } = await getBugs();
    fetched.then(res => dispatch(updateResults(res)));

    dispatch(updateResults({ bugs, metas }));
  };
}

function updateResults(value) {
  return { type: 'SET_RESULTS', value };
}

export function setPage(page) {
  return { type: 'SET_PAGE', page };
}
