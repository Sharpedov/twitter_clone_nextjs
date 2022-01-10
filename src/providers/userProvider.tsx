import { useRouter } from "next/router";
import React, { createContext, useContext, useMemo } from "react";
import { useDispatch } from "react-redux";
import ScreenLoader from "src/components/loaders/screenLoader";
import { logout } from "src/store/slices/authSlice";
import { UserType } from "src/types";
import { authFetcher } from "src/utils/authAxiosMethods";
import useSWR from "swr";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

interface Props {}

const UserProvider: React.FC<Props> = ({ children }) => {
	const { data, mutate, error } = useSWR<UserType>(
		"/api/auth/getLoggedUser",
		authFetcher
	);
	const dispatch = useDispatch();
	const { replace } = useRouter();

	const memoredValue = useMemo(
		() => ({
			user: data,
			loading: !data && !error,
			mutate,
			isLogged: Boolean(data && !error),
			isLoggedOut: Boolean(error),
			logout: () => dispatch(logout({ onComplete: () => replace("/") })),
		}),
		[data, error, mutate, dispatch, replace]
	);

	return (
		<UserContext.Provider value={memoredValue}>
			{memoredValue.loading ? <ScreenLoader /> : children}
		</UserContext.Provider>
	);
};

export default UserProvider;
