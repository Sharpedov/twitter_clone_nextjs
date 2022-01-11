import React from "react";
import Head from "next/head";
import styled from "styled-components";
import SpinnerLoader from "src/components/loaders/spinnerLoader";
import { TweetType, UserType } from "src/types";
import TweetCard from "src/components/tweetCard";
import { useSWRInfinitePagination } from "src/hooks/useSWRInfinitePagination";

interface User extends UserType {
	loading: boolean;
	error: any;
}

export default function Profile(props) {
	const userData: User = props.userData;
	const {
		fetchedData,
		isLoadingInitialData,
		isLoadingMore,
		isEmpty,
		hasNextPage,
		error,
		mutate,
		lastItemRef,
	} = useSWRInfinitePagination({
		queryKey: `/api/tweet/userTweets?userId=${userData._id}&limit=${15}`,
	});
	const data: TweetType[] = fetchedData;

	return (
		<>
			<Head>
				<title>
					{!!userData.loading
						? "Profile / Twitter"
						: `${userData.name} (@${userData.tag_name}) / Twitter`}
				</title>
			</Head>
			{error ? (
				<div>{error.message}</div>
			) : isLoadingInitialData ? (
				<SpinnerLoader loading={true} center />
			) : (
				<TweetsContainer>
					{data.map((tweet) => (
						<TweetCard ref={lastItemRef} key={tweet._id} tweetData={tweet} />
					))}
					{isLoadingMore && !isLoadingInitialData && (
						<SpinnerLoader loading={true} center />
					)}
					{isEmpty && !userData.myProfile ? (
						<EmptyContainer>
							<span>{`@${userData.tag_name} does not send any tweet yet`}</span>
							<span>This user&apos;s tweets will appear here.</span>
						</EmptyContainer>
					) : (
						hasNextPage && <div style={{ height: "200px" }} />
					)}
				</TweetsContainer>
			)}
		</>
	);
}

const TweetsContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	width: 100%;
`;

const EmptyContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-self: center;
	max-width: 400px;
	width: 100%;
	padding: 32px;
	margin: 0 auto;

	& > span {
		text-align: left;
		overflow-wrap: break-word;
		&:nth-child(1) {
			line-height: 36px;
			font-size: 30px;
			margin-bottom: 8px;
			font-weight: 800;
			color: ${({ theme }) => theme.colors.text.primary};
		}
		&:nth-child(2) {
			line-height: 20px;
			font-size: 15px;
			font-weight: 400;
			margin-bottom: 28px;
			color: ${({ theme }) => theme.colors.text.secondary};
		}
	}
`;
