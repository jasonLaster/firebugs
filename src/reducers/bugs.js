import { isIntermittent } from '../utils';

const initialState = {
  bugs: [],
  bugsMap: {},
  metas: [],
  intermittents: JSON.parse(localStorage.getItem('intermittents')) || {},
};

export default function update(state = initialState, action) {
  switch (action.type) {
    case 'SET_RESULTS': {
      return { ...state, ...action.value };
    }

    case 'SET_INTERMITTENTS': {
      return { ...state, ...action.value };
    }
  }
  return state;
}

export function getIntermittents(state) {
  return state.bugs.bugs.filter(b => isIntermittent(b));
}
