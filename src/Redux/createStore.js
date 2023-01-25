import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { User } from "./authReducer";
import { Categories } from "./Reducers/categories";
import { Occasions } from "./Reducers/occasions";
import { Interests } from "./Reducers/interests";
import { Recipients } from "./Reducers/recipients";
import { Users } from "./Reducers/users";
import { Products } from "./Reducers/products";
import { Key } from "./Reducers/sidebarKey";

const rootReducer = combineReducers({
  user: User,
  categories: Categories,
  occasions: Occasions,
  interests: Interests,
  recipients: Recipients,
  users: Users,
  products: Products,
  key: Key,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const persistor = persistStore(store);

export { store, persistor };
