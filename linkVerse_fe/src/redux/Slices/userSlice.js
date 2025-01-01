import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    userId: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    bio: "",
    city: null,
    emailVerified: false,
    createdAt: "",
    token: "",
    phoneNumber: "",
    dob: "",
    status: "",
    roles: [],
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
                bio = "",
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
            state.bio = bio
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
            localStorage.removeItem("showedSplashscreen");
            state.lastName = ""
            state.userId = ""
            state.firstName = ""
            state.id = ""
            state.bio = ""
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
        }
    },
});

export const { updateUser, resetUser, updateStatus } = userSlice.actions

export default userSlice.reducer;
