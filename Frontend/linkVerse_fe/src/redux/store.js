import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '~/redux/Slices/themeSlice'
import userReducer from '~/redux/Slices/userSlice'
import languageReducer from '~/redux/Slices/languageSlice'

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        user: userReducer,
        language: languageReducer
    },
})