import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { authPoster } from "src/utils/authAxiosMethods";
import { mutate } from "swr";
import { addNotification } from "./notificationsSlice";

interface CheckEmailIsExists {
	email: string;
	onComplete?: () => void;
}
interface CheckTagNameIsExists {
	tagName: string;
	onComplete?: () => void;
}
interface CreateAccount {
	name: string;
	email: string;
	password: string;
	repeatPassword: string;
	tagName: string;
	onComplete?: () => void;
}
interface Login {
	email: string;
	password: string;
	onComplete?: () => void;
}
interface Logout {
	onComplete?: () => void;
}

export const checkEmailIsExists = createAsyncThunk(
	"auth/checkEmailIsExists",
	async ({ email, onComplete }: CheckEmailIsExists) => {
		try {
			await axios.post("/api/auth/checkEmailIsExists", { email: email.trim() });

			onComplete && onComplete();

			return;
		} catch (error) {
			throw error.response.data.message;
		}
	}
);

export const checkTagNameIsExists = createAsyncThunk(
	"auth/checkTagNameIsExists",
	async ({ tagName, onComplete }: CheckTagNameIsExists) => {
		try {
			await axios.post("/api/auth/checkTagNameIsExists", {
				tag_name: tagName.trim(),
			});

			onComplete && onComplete();

			return;
		} catch (error) {
			throw error.response.data.message;
		}
	}
);

export const createAccount = createAsyncThunk(
	"auth/createAccount",
	async (
		{
			name,
			email,
			password,
			repeatPassword,
			tagName,
			onComplete,
		}: CreateAccount,
		{ dispatch }
	) => {
		try {
			await axios.post("/api/auth/createAccount", {
				name: name.trim(),
				email: email.trim(),
				password,
				repeat_password: repeatPassword,
				tag_name: tagName.trim(),
			});

			onComplete && onComplete();

			return;
		} catch (error) {
			console.error("ERROR ERROR ERROR", error);
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

export const login = createAsyncThunk(
	"auth/login",
	async ({ email, password, onComplete }: Login, { dispatch }) => {
		try {
			await axios
				.post("/api/auth/login", { email: email.trim(), password })
				.then((res) => res.data);
			await mutate("/api/auth/getLoggedUser");

			onComplete && onComplete();

			return;
		} catch (error) {
			dispatch(addNotification({ message: "Incorrect data" }));
			throw error.response.data.message;
		}
	}
);

export const logout = createAsyncThunk(
	"auth/logout",
	async ({ onComplete }: Logout, { dispatch }) => {
		try {
			await authPoster("/api/auth/logout");
			await mutate("/api/auth/getLoggedUser");

			onComplete && onComplete();

			return;
		} catch (error) {
			dispatch(addNotification({ message: "Something went wrong" }));
			return;
		}
	}
);

const initialState = {
	createAccount: {
		loading: false as boolean,
		error: null as unknown,
	},
	login: {
		loading: false as boolean,
		error: null as unknown,
	},
	checkEmail: {
		loading: false as boolean,
		error: null as unknown,
	},
	checkTagName: {
		loading: false as boolean,
		error: null as unknown,
	},
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		//// checkEmailIsExists
		builder.addCase(checkEmailIsExists.pending, (state) => {
			state.checkEmail.loading = true;
			state.checkEmail.error = null;
		});
		builder.addCase(checkEmailIsExists.fulfilled, (state) => {
			state.checkEmail.loading = false;
		});
		builder.addCase(checkEmailIsExists.rejected, (state, action) => {
			state.checkEmail.loading = false;
			state.checkEmail.error = action.error.message;
		});

		//// checkTagNameIsExists
		builder.addCase(checkTagNameIsExists.pending, (state) => {
			state.checkTagName.loading = true;
			state.checkTagName.error = null;
		});
		builder.addCase(checkTagNameIsExists.fulfilled, (state) => {
			state.checkTagName.loading = false;
		});
		builder.addCase(checkTagNameIsExists.rejected, (state, action) => {
			state.checkTagName.loading = false;
			state.checkTagName.error = action.error.message;
		});

		//// createAccount
		builder.addCase(createAccount.pending, (state) => {
			state.createAccount.loading = true;
			state.createAccount.error = null;
		});
		builder.addCase(createAccount.fulfilled, (state) => {
			state.createAccount.loading = false;
		});
		builder.addCase(createAccount.rejected, (state, action) => {
			state.createAccount.loading = false;
			state.createAccount.error = action.error.message;
		});

		//// login
		builder.addCase(login.pending, (state) => {
			state.login.loading = true;
			state.login.error = null;
		});
		builder.addCase(login.fulfilled, (state) => {
			state.login.loading = false;
		});
		builder.addCase(login.rejected, (state, action) => {
			state.login.loading = false;
			state.login.error = action.error.message;
		});
	},
});

export default authSlice.reducer;
