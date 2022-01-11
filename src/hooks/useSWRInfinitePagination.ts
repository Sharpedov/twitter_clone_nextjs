import { useCallback, useRef } from "react";
import { authFetcher } from "src/utils/authAxiosMethods";
import { fetcher } from "src/utils/fetcher";
import useSWRInfinite from "swr/infinite";

interface Props {
	queryKey: string;
	authMethod?: boolean;
}

export const useSWRInfinitePagination = ({ queryKey, authMethod }: Props) => {
	const { data, error, isValidating, mutate, size, setSize } = useSWRInfinite(
		(index) => `${queryKey}&page=${index + 1}`,
		authMethod ? authFetcher : fetcher
	);
	const observer = useRef(null!);

	const fetchedData = data ? [].concat(...data) : [];
	const isLoadingInitialData = !data && !error;
	const isLoadingMore =
		isLoadingInitialData ||
		(size > 0 && data && typeof data[size - 1] === "undefined");
	const isEmpty = data?.[0]?.length === 0;
	const hasNextPage = isEmpty || (data && data[data.length - 1]?.length < 3);
	const isRefreshing = isValidating && data && data.length === size;
	const lastItemRef = useCallback(
		(node) => {
			const fetchNextPage = () => setSize((size) => size + 1);
			if (isLoadingMore || hasNextPage) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && !hasNextPage) {
					console.log("fetch");
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoadingMore, hasNextPage, setSize]
	);

	return {
		fetchedData,
		size,
		setSize,
		error,
		isLoadingInitialData,
		isLoadingMore,
		isEmpty,
		hasNextPage,
		isRefreshing,
		mutate,
		lastItemRef,
	};
};
