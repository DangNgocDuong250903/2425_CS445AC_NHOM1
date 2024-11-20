import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    avatar: "",
    email: "",
    access_token: "",
    profession: "",
    storie: "",
    isAdmin: true
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logOut(state, action) {
            state.access_token = ''
        },
        logIn(state, action) {
            state.access_token = 'abc'
        }
    },
});

export const { logOut, logIn } = userSlice.actions

export default userSlice.reducer;
