import { combineReducers } from "redux";

// Front
import LayoutReducer from "./reducer";
const rootReducer = combineReducers({
    Layout: LayoutReducer
});

export default rootReducer;