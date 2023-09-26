import { AuthReducer } from "../redux/AuthReducer";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";

const rootReducers = combineReducers({
  Auth: AuthReducer,
});

const store = configureStore({ reducer: rootReducers }, composeWithDevTools());

export default store;
