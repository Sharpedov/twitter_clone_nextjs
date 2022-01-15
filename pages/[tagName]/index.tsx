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
		isLoadingMore,
		isEmpty,
		isReachedEnd,
		error,
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
			<TweetsContainer>
				{userData.loading ? (
					<SpinnerLoader loading={true} center paddingBottom={60} />
				) : (
					<>
						{error ? (
							<ErrorMessage>
								<span>Something went wrong.</span>
							</ErrorMessage>
						) : (
							<>
								{data.map((tweet, i) => {
									if (data.length === i + 1) {
										return (
											<TweetCard
												ref={lastItemRef}
												key={tweet._id}
												tweetData={tweet}
											/>
										);
									} else {
										return <TweetCard key={tweet._id} tweetData={tweet} />;
									}
								})}
							</>
						)}
						{isEmpty && !userData.myProfile && (
							<EmptyContainer>
								<span>{`@${userData.tag_name} does not send any tweet yet`}</span>
								<span>This user&apos;s tweets will appear here.</span>
							</EmptyContainer>
						)}
						{isLoadingMore ? (
							<SpinnerLoader loading={true} center paddingBottom={60} />
						) : (
							isReachedEnd && <div style={{ height: "200px" }} />
						)}
					</>
				)}
			</TweetsContainer>
		</>
	);
}

const TweetsContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	width: 100%;
`;

const ErrorMessage = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 auto;
	padding: 32px 16px;
	text-align: center;
	width: 100%;
	font-size: 17px;
	line-height: 20px;
	color: ${({ theme }) => theme.colors.text.secondary};
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
