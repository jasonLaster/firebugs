const initialState = {
  priority: null,
  keyword: null,
  meta: null,
  search: '',
  type: null,
  page: 'bugs',
};

function updateUrl({ page, keyword, meta, search, priority, type }) {
  let parts = [];

  if (keyword) {
    parts.push(`keyword=${encodeURIComponent(keyword)}`);
  }

  if (meta) {
    parts.push(`meta=${encodeURIComponent(meta)}`);
  }

  if (type) {
    parts.push(`type=${encodeURIComponent(type)}`);
  }

  // if (search) {
  //   parts.push(`search=${encodeURIComponent(search)}`);
  // }

  if (priority) {
    parts.push(`priority=${priority}`);
  }

  window.location = `#${page}${parts.length > 0 ? '?' : ''}${parts.join('&')}`;
}

export default function update(state = initialState, action) {
  switch (action.type) {
    case 'SET_PAGE': {
      const filters = { ...state, page: action.page };
      updateUrl(filters);
      return filters;
    }
    case 'SET_FILTER': {
      const filters = { ...state, ...action.value };
      updateUrl(filters);
      return filters;
    }
  }
  return state;
}
