import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        token: 'abc'
    }
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logOut(state, action) {
            state.user.token = ''
        },
        logIn(state, action) {
            state.user.token = 'abc'
        }
    },
});

export const { logOut, logIn } = userSlice.actions

export default userSlice.reducer;
