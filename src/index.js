import LogRocket from 'logrocket';

import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';

import App from './components/App';

import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import store from './store';
import * as actions from './actions';

import './index.css';

window.store = store;
window.actions = bindActionCreators(actions, store.dispatch);

LogRocket.init('sssxa4/firebugs');


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
