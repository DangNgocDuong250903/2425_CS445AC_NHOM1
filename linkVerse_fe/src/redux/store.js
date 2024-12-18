import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '~/redux/Slices/themeSlice'
import userReducer from '~/redux/Slices/userSlice'
import languageReducer from '~/redux/Slices/languageSlice'
import postReducer from "~/redux/Slices/postSlice"

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        user: userReducer,
        language: languageReducer,
        post: postReducer
    },
})