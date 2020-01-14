import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { createStore, combineReducers, applyMiddleware } from "redux";
import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter
} from "connected-react-router";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "react-tippy/dist/tippy.css";

import App from "./components/app/App";
import reducers from "./state";
import sagas from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const history = createBrowserHistory();

const store = createStore(
  combineReducers({
    ...reducers,
    router: connectRouter(history)
  }),
  applyMiddleware(routerMiddleware(history), sagaMiddleware)
);
sagaMiddleware.run(sagas);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
