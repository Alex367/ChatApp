import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    logged: {},
    connectionStatus: false,
    errorFetchChatData: false,
    avatarPath: "",
};

const chatReduxFunctions = createSlice({
    name: "chatMessages",
    initialState,
    reducers: {
        populateMessage(state, action) {
            state.messages = [...action.payload];
        },
        setLoginData(state, action) {
            state.logged = action.payload;
        },
        addNewMessages(state, action) {
            state.messages.push(action.payload);
        },
        clearAllMessages(state) {
            state.messages = [];
        },
        clearLogged(state) {
            state.logged = [];
            state.connectionStatus = false;
            state.errorFetchChatData = false;
            state.avatarPath = "";
        },
        setConnectionStatus(state, action) {
            state.connectionStatus = action.payload;
        },
        deleteOneMessage(state, action) {
            const newData = state.messages.filter(
                (item) => item._id !== action.payload._id
            );
            state.messages = [...newData];
        },
        updateUsernameInMessages(state, action) {
            for (let i in state.messages) {
                if (state.messages[i].username === action.payload.old) {
                    state.messages[i].username = action.payload.new;
                }
            }
        },
        setErrorFetchChatData(state, action) {
            state.errorFetchChatData = action.payload;
        },
        populateAvatar(state, action) {
            state.avatarPath = action.payload;
        },
    },
});

const store = configureStore({
    reducer: { doMessages: chatReduxFunctions.reducer },
});

export const chatActions = chatReduxFunctions.actions;
export default store;