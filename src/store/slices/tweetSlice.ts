import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authPoster } from "src/utils/authAxiosMethods";
import { addNotification } from "./notificationsSlice";

interface CreateTweer {
	text: string;
	userId: string;
	tweetImageUrl: string;
	paddingBottom: number;
	onComplete?: () => void;
}

export const createTweet = createAsyncThunk(
	"tweet/createTweet",
	async (
		{ text, userId, tweetImageUrl, paddingBottom, onComplete }: CreateTweer,
		{ dispatch }
	) => {
		try {
			await authPoster("/api/tweet/createTweet", {
				text: text.trim(),
				tweet_image_url: tweetImageUrl ? tweetImageUrl.trim() : "",
				user_id: userId,
				padding_bottom: paddingBottom,
			});

			onComplete && onComplete();

			dispatch(addNotification({ message: "Tweet was created", time: 2000 }));

			return;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

const initialState = {
	create: {
		loading: false as boolean,
		error: null as unknown,
	},
};

const tweetSlice = createSlice({
	name: "tweet",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(createTweet.pending, (state) => {
			state.create.loading = true;
			state.create.error = null;
		});
		builder.addCase(createTweet.fulfilled, (state) => {
			state.create.loading = false;
		});
		builder.addCase(createTweet.rejected, (state, action) => {
			state.create.loading = false;
			state.create.error = action.error.message;
		});
	},
});

export default tweetSlice.reducer;
