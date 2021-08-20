import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from "redux-persist";
import logger from "redux-logger";

import rootReducer from "./rootReducer";

const middlewares = [];

// Only use the logger in the development mode
if (process.env.NODE_ENV === "development") {
	middlewares.push(logger);
}

//For Redux dev tools
const composeEnhancers =
	typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
				// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
		  })
		: compose;

const enhancer = composeEnhancers(
	applyMiddleware(...middlewares)
	// other store enhancers if any
);
const store = createStore(rootReducer, enhancer);

const persistor = persistStore(store);

export { store, persistor };
