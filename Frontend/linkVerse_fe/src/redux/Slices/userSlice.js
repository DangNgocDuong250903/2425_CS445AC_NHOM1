import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    userId: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    city: null,
    token: "",
    dob: "",
    status: ""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser(state, action) {
            const {
                id = "",
                firstName = "",
                userId = "",
                lastName = "",
                email = "",
                username = "",
                city = null,
                token = "",
                dob = "",
                status = "",
            } = action.payload

            state.lastName = lastName
            state.firstName = firstName
            state.userId = userId
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
            state.userId = ""
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
