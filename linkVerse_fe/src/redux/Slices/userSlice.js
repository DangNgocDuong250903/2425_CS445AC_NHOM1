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
    phoneNumber: "",
    dob: "",
    status: "",
    roles: [],
    friends: 0
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
                phoneNumber = "",
                createdAt = "",
                city = null,
                token = "",
                dob = "",
                emailVerified = false,
                status = "",
                roles = [],
                imageUrl = "",
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
            state.phoneNumber = phoneNumber
            state.city = city
            state.emailVerified = emailVerified
            state.token = token
            state.status = status
            state.roles = roles
        },
        resetUser(state, action) {
            localStorage?.removeItem("token");
            localStorage.removeItem("sentiment");
            state.lastName = ""
            state.userId = ""
            state.firstName = ""
            state.id = ""
            state.dob = ""
            state.avatar = ""
            state.createdAt = ""
            state.phoneNumber = ""
            state.emailVerified = false
            state.city = null
            state.token = ""
            state.username = ""
            state.roles = []
        },
        updateStatus(state, action) {
            state.status = action.payload
        },
        updateFriends(state, action) {
            state.friends = action.payload
        }
    },
});

export const { updateUser, resetUser, updateFriends, updateStatus } = userSlice.actions

export default userSlice.reducer;
