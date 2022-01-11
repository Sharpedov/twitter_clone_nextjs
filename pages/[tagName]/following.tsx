import React from "react";
import Head from "next/head";
import styled from "styled-components";
import SpinnerLoader from "src/components/loaders/spinnerLoader";
import { UserType } from "src/types";
import { useUser } from "src/providers/userProvider";
import FollowedUserCard from "src/components/followedUserCard";
import { useSWRInfinitePagination } from "src/hooks/useSWRInfinitePagination";

interface User extends UserType {
	loading: boolean;
	error: any;
}

export default function ProfileFollowing(props) {
	const { user } = useUser();
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
		queryKey: `/api/user/userFollowing?tag_name=${
			userData.tag_name
		}&profile_id=${user._id}&limit=${15}`,
	});
	const data: UserType[] = fetchedData;

	return (
		<>
			<Head>
				<title>Following</title>
			</Head>
			<FollowersContainer>
				{error ? (
					<div>{error.message}</div>
				) : isLoadingInitialData ? (
					<SpinnerLoader loading={true} center />
				) : (
					data.map((follow) => (
						<FollowedUserCard
							ref={lastItemRef}
							key={`followers-${follow._id}`}
							followUserData={follow}
							userId={user._id}
							mutate={mutate}
						/>
					))
				)}
				{isLoadingMore && !isLoadingInitialData && (
					<SpinnerLoader loading={true} center />
				)}
				{isEmpty && !userData.myProfile ? (
					<EmptyContainer>
						<span>{`@${userData.tag_name} isn't following anyone`}</span>
						<span>When they do, they&apos;ll be listed here.</span>
					</EmptyContainer>
				) : (
					hasNextPage && <div style={{ height: "200px" }} />
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
