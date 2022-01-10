import React from "react";
import Head from "next/head";
import styled from "styled-components";
import { fetcher } from "src/utils/fetcher";
import useSWR from "swr";
import SpinnerLoader from "src/components/loaders/spinnerLoader";
import { TweetType, UserType } from "src/types";
import TweetCard from "src/components/tweetCard";

interface User extends UserType {
	loading: boolean;
	error: any;
}

export default function ProfileName(props) {
	const userData: User = props.userData;

	const { data: tweetsData, error: tweetsError } = useSWR<TweetType[]>(
		userData.tag_name &&
			!userData.error &&
			`/api/tweet/userTweets?userId=${userData._id}&limit=${10}&page=${1}`,
		fetcher
	);

	return (
		<>
			<Head>
				<title>
					{!!userData.loading
						? "Profile / Twitter"
						: `${userData.name} (@${userData.tag_name}) / Twitter`}
				</title>
			</Head>
			{!tweetsData ? (
				<SpinnerLoader loading={true} center />
			) : tweetsError ? (
				<div>{tweetsError}</div>
			) : (
				<TweetsContainer>
					{tweetsData.map((tweet) => (
						<TweetCard key={tweet._id} tweetData={tweet} />
					))}
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
