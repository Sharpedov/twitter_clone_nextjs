import React from "react";
import Head from "next/head";
import styled from "styled-components";
import SpinnerLoader from "src/components/loaders/spinnerLoader";
import { UserType } from "src/types";
import useSWR from "swr";
import { authFetcher } from "src/utils/authAxiosMethods";
import { useUser } from "src/providers/userProvider";
import FollowedUserCard from "src/components/followedUserCard";

interface User extends UserType {
	loading: boolean;
	error: any;
}

export default function ProfileFollowers(props) {
	const { user } = useUser();
	const userData: User = props.userData;
	const {
		data: followers,
		error: followersError,
		mutate: followersMutate,
	} = useSWR<UserType[]>(
		user._id &&
			userData.tag_name &&
			`/api/user/userFollowers?tag_name=${userData.tag_name}&profile_id=${user._id}`,
		authFetcher
	);

	return (
		<>
			<Head>
				<title>Followers</title>
			</Head>
			<FollowersContainer>
				{followersError ? (
					<div>{followersError.message}</div>
				) : !followers ? (
					<SpinnerLoader loading={true} center />
				) : (
					followers.map((follow) => (
						<FollowedUserCard
							key={`followers-${follow._id}`}
							followUserData={follow}
							userId={user._id}
							mutate={followersMutate}
						/>
					))
				)}
			</FollowersContainer>
		</>
	);
}

const FollowersContainer = styled.section`
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 120vh;
`;
