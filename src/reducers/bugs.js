const initialState = {
  bugs: [],
  bugsMap: {},
  metas: [],
};

export default function update(state = initialState, action) {
  switch (action.type) {
    case 'SET_RESULTS': {
      return { ...state, ...action.value };
    }
  }
  return state;
}
