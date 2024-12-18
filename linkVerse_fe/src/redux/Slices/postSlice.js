import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sentiment: localStorage.getItem("sentiment") ?? "Positive"
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setSentiment(state, action) {
            state.sentiment = action.payload
            localStorage.setItem("sentiment", action.payload)
        }
    },
});

export const { setSentiment } = postSlice.actions

export default postSlice.reducer;

