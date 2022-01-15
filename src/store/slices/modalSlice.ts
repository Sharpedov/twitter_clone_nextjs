import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	notLogged: {
		isOpen: false as boolean,
	},
};

const modalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		openNotLoggedModal: (state) => {
			state.notLogged.isOpen = true;
		},
		closeNotLoggedModal: (state) => {
			state.notLogged.isOpen = false;
		},
	},
});

export const { openNotLoggedModal, closeNotLoggedModal } = modalSlice.actions;

export default modalSlice.reducer;
