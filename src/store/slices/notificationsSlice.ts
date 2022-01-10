import { createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";

interface AddNotificationPayload {
	payload: {
		message: string;
		time?: number;
	};
}

interface RemoveNotificationPayload {
	payload: {
		id: string;
	};
}

const initialState = {
	notifications: [],
};

const notificationsSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		addNotification: (state, action: AddNotificationPayload) => {
			const { message, time } = action.payload;

			state.notifications = [{ id: v4(), message, time: time ?? 5000 }];
		},

		removeNotification: (state, action: RemoveNotificationPayload) => {
			state.notifications = state.notifications.filter(
				(notifi) => notifi.id !== action.payload.id
			);
		},

		clearNotifications: (state) => {
			state.notifications = [];
		},
	},
});

export const { addNotification, removeNotification, clearNotifications } =
	notificationsSlice.actions;

export default notificationsSlice.reducer;
