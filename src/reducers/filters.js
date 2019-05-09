const initialState = {
  priority: 'All',
  keyword: null,
  meta: null,
  search: '',
  page: 'bugs',
};

export default function update(state = initialState, action) {
  switch (action.type) {
    case 'SET_PAGE': {
      return { ...state, page: action.page };
    }
    case 'SET_FILTER': {
      return { ...state, ...action.value };
    }
  }
  return state;
}
