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
    createdAt: "",
    token: "",
    dob: "",
    status: "",
    roles: [],
    friends: ""
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
                createdAt = "",
                city = null,
                token = "",
                dob = "",
                emailVerified = false,
                status = "",
                roles = [],
                imageUrl = "",
                friends = ""
            } = action.payload

            state.lastName = lastName
            state.firstName = firstName
            state.userId = userId
            state.avatar = imageUrl
            state.id = id
            state.email = email
            state.createdAt = createdAt
            state.dob = dob
            state.username = username
            state.city = city
            state.emailVerified = emailVerified
            state.token = token
            state.status = status
            state.roles = roles
            state.friends = friends
        },
        resetUser(state, action) {
            state.lastName = ""
            state.userId = ""
            state.firstName = ""
            state.id = ""
            state.dob = ""
            state.avatar = ""
            state.createdAt = ""
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
