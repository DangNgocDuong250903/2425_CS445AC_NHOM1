import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    city: null,
    token: "",
    dob: "",
    status: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser(state, action) {
            const {
                id = "",
                firstName = "",
                lastName = "",
                email = "",
                username = "",
                city = null,
                token = "",
                dob = "",
                status = null,
            } = action.payload

            state.lastName = lastName
            state.firstName = firstName
            state.id = id
            state.email = email
            state.dob = dob
            state.username = username
            state.city = city
            state.token = token
            state.status = status
        },
        resetUser(state, action) {
            state.lastName = ""
            state.firstName = ""
            state.id = ""
            state.dob = ""
            state.city = null
            state.token = ""
            state.username = ""
        }
    },
});

export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer;
