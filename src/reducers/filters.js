const initialState = {
  priority: null,
  keyword: null,
  meta: null,
  search: '',
  type: null,
  changed: null,
  sortBy: null,
  whiteboard: null,
  page: 'bugs',
  product: 'devtools',
  component: 'debugger',
};

function updateUrl({
  page,
  keyword,
  meta,
  search,
  priority,
  type,
  changed,
  sortBy,
  whiteboard,
  product,
  component
}) {
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
  if (changed) {
    parts.push(`changed=${encodeURIComponent(changed)}`);
  }
  if (whiteboard) {
    parts.push(`whiteboard=${encodeURIComponent(whiteboard)}`);
  }
  if (sortBy) {
    parts.push(`sortBy=${encodeURIComponent(sortBy)}`);
  }

  // if (search) {
  //   parts.push(`search=${encodeURIComponent(search)}`);
  // }

  if (priority) {
    parts.push(`priority=${priority}`);
  }

  if (parts.length > 0) {
    window.location = `#${page}${parts.length > 0 ? '?' : ''}${parts.join('&')}/${product}/${component}`;
  } else {
    window.location = `#${page}/${product}/${component}`;
  }
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
