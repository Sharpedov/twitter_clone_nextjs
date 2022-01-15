import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import modalSlice from "./slices/modalSlice";
import notificationsSlice from "./slices/notificationsSlice";
import tweetSlice from "./slices/tweetSlice";
import userSlice from "./slices/userSlice";

const reducer = combineReducers({
	auth: authSlice,
	user: userSlice,
	tweet: tweetSlice,
	notifications: notificationsSlice,
	modal: modalSlice,
});

const store = configureStore({
	reducer,
});

export default store;
