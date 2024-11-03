import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "./Slices/userSlice";
import themeSlice from "./Slices/theme";
import postSlice from "./Slices/postSlice";

const rootReducer = combineReducers({
    user: userSlice,
    theme: themeSlice,
    posts: postSlice,
});

export { rootReducer };
