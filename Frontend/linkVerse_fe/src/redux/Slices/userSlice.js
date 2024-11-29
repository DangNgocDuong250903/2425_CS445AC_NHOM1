import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatar: "",
    password: "",
    sex: "",
    address: "",
    access_token: "",
    profession: "",
    birthday: "",
    roles: [],
    followers: [],
    following: [],
    isActive: true,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser(state, action) {
            const { _id = "",
                firstName = "",
                lastName = "",
                email = "",
                password = "",
                sex = "",
                access_token = "",
                birthday = "",
                roles = [],
                isActive = true,
                following = [],
                followers = []
            } = action.payload

            state.lastName = lastName
            state.firstName = firstName
            state.id = _id
            state.email = email
            state.birthday = birthday
            state.sex = sex
            state.roles = roles
            state.isActive = isActive
            state.access_token = access_token
            state.password = password
            state.followers = followers
            state.following = following
        }
    },
});

export const { updateUser } = userSlice.actions

export default userSlice.reducer;
