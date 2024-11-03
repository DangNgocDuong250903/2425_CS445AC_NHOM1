import { combineReducers } from "@reduxjs/toolkit";

import postSlice from "./Slices/postSlice";
import themeSlice from "./Slices/theme";
import userSlice from "./Slices/userSlice";

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,
});

export { rootReducer };
