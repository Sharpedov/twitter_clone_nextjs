import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authPatcher } from "src/utils/authAxiosMethods";
import { mutate } from "swr";
import { addNotification } from "./notificationsSlice";

interface EditProfile {
	tag_name: string;
	name: string;
	profileBannerUrl: string;
	profileImageUrl: string;
	description: string;
	location: string;
	url: string;
	onComplete?: () => void;
}

interface FollowUser {
	tag_name: string;
	profile_id: string;
	onComplete?: () => void;
}

export const updateProfile = createAsyncThunk(
	"user/updateProfile",
	async (
		{
			tag_name,
			name,
			profileBannerUrl,
			profileImageUrl,
			description,
			location,
			onComplete,
			url,
		}: EditProfile,
		{ dispatch }
	) => {
		try {
			await authPatcher("/api/user/updateProfile", {
				tag_name: tag_name.trim(),
				name: name.trim(),
				profile_banner_url: profileBannerUrl.trim(),
				profile_image_url: profileImageUrl.trim(),
				description: description.trim(),
				location: location.trim(),
				url: url.trim(),
			});

			onComplete && onComplete();

			return;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

export const followUser = createAsyncThunk(
	"user/followUser",
	async ({ tag_name, profile_id, onComplete }: FollowUser, { dispatch }) => {
		try {
			await authPatcher("/api/user/followUser", { tag_name, profile_id });

			onComplete && onComplete();
			await mutate("/api/auth/getLoggedUser");
			await mutate(
				`/api/user/userByTagName?tag_name=${tag_name}&profile_id=${profile_id}`
			);

			return;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			return error.response.data.message;
		}
	}
);

export const unfollowUser = createAsyncThunk(
	"user/unfollowUser",
	async ({ tag_name, profile_id, onComplete }: FollowUser, { dispatch }) => {
		try {
			await authPatcher("/api/user/unfollowUser", { tag_name, profile_id });

			onComplete && onComplete();
			await mutate("/api/auth/getLoggedUser");
			await mutate(
				`/api/user/userByTagName?tag_name=${tag_name}&profile_id=${profile_id}`
			);

			return;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			return error.response.data.message;
		}
	}
);

const initialState = {
	update: {
		loading: false as boolean,
		error: null as unknown,
	},
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		//// update profile
		builder.addCase(updateProfile.pending, (state) => {
			state.update.loading = true;
			state.update.error = null;
		});
		builder.addCase(updateProfile.fulfilled, (state) => {
			state.update.loading = false;
		});
		builder.addCase(updateProfile.rejected, (state, action) => {
			state.update.loading = false;
			state.update.error = action.error.message;
		});
	},
});

export default userSlice.reducer;
