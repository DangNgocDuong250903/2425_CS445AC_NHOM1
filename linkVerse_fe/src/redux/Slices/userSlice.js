import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    userId: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    city: null,
    emailVerified: false,
    token: "",
    dob: "",
    status: "",
    roles: []
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
                emailVerified = false,
                status = "",
                roles = []
            } = action.payload

            state.lastName = lastName
            state.firstName = firstName
            state.userId = userId
            state.id = id
            state.email = email
            state.dob = dob
            state.username = username
            state.city = city
            state.emailVerified = emailVerified
            state.token = token
            state.status = status
            state.roles = roles
        },
        resetUser(state, action) {
            state.lastName = ""
            state.userId = ""
            state.firstName = ""
            state.id = ""
            state.dob = ""
            state.emailVerified = false
            state.city = null
            state.token = ""
            state.username = ""
            state.roles = []
        }
    },
});

export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer;