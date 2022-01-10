import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Avatar } from "@mui/material";
import TopBar from "src/components/topBar";
import { UserType } from "src/types";
import Feed from "src/components/feed";
import Widgets from "src/components/widgets";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ScrollSnapList from "src/components/scrollSnapList";
import { useUser } from "src/providers/userProvider";
import useSWR from "swr";
import { fetcher } from "src/utils/fetcher";
import { useDispatch } from "react-redux";
import { followUser, unfollowUser } from "src/store/slices/userSlice";

interface Props {}

interface userData extends UserType {
	loading: boolean;
	myProfile: boolean;
}

const ProfileFollowsTemplate: React.FC<Props> = ({ children }) => {
	const { user, loading } = useUser();
	const { query, back, pathname } = useRouter();
	const { data: profileData, error: profileError } = useSWR<UserType>(
		query.tagName &&
			`/api/user/userByTagName?tag_name=${query.tagName}&profile_id=${user._id}`,
		fetcher
	);
	const [followUserLoading, setFollowUserLoading] = useState<boolean>(false);
	const [unfollowUserLoading, setUnfollowUserLoading] =
		useState<boolean>(false);
	const dispatch = useDispatch();

	const userData: userData = useMemo(() => {
		switch (query.tagName) {
			case user?.tag_name: {
				return { ...user, loading, myProfile: true };
			}
			default: {
				return {
					...profileData,
					loading: !profileData && !profileError,
					error: profileError,
					myProfile: false,
				};
			}
		}
	}, [query.tagName, loading, user, profileData, profileError]);

	const scrollSnapList = [
		{
			text: "Followers",
			href: `/${query.tagName}/followers`,
			active: pathname === "/[tagName]/followers",
		},
		{
			text: "Following",
			href: `/${query.tagName}/following`,
			active: pathname === "/[tagName]/following",
		},
	];

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, { userData });
		}
		return child;
	});

	const handleFollowUser = useCallback(async () => {
		if (!userData.myProfile) {
			setFollowUserLoading(true);
			await dispatch(
				followUser({ tag_name: userData.tag_name, profile_id: user._id })
			);
			setFollowUserLoading(false);
		}
	}, [dispatch, userData, user]);

	const handleUnfollowUser = useCallback(async () => {
		if (!userData.myProfile) {
			setUnfollowUserLoading(true);
			await dispatch(
				unfollowUser({ tag_name: userData.tag_name, profile_id: user._id })
			);
			setUnfollowUserLoading(false);
		}
	}, [dispatch, userData, user]);

	return (
		<>
			<Feed>
				<TopBar
					loading={userData.loading}
					onClose={() => back()}
					Icon={ArrowBackRoundedIcon}
					iconAriaLabel="Go back"
				>
					<TopBarInner>
						<TopBarInnerColumn>
							{userData.loading ? (
								<span>Profile</span>
							) : (
								<>
									<span className="appear">{userData.name}</span>
									<span className="appear">{`@${userData.tag_name}`}</span>
								</>
							)}
						</TopBarInnerColumn>
					</TopBarInner>
				</TopBar>
				<TopBarBottom>
					<ScrollSnapList list={scrollSnapList} />
				</TopBarBottom>
				{childrenWithProps}
			</Feed>

			<Widgets />
		</>
	);
};

export default ProfileFollowsTemplate;

const TopBarInner = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;
	padding: 0 16px;
	margin: 0 auto;
	margin-left: 12px;
`;

const TopBarInnerColumn = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;

	& > span {
		display: inline-flex;
		white-space: nowrap;
		overflow-wrap: break-word;

		&:nth-child(1) {
			line-height: 19px;
			font-size: 15px;
			font-weight: 700;
			color: ${({ theme }) => theme.colors.text.primary};
		}
		&:nth-child(2) {
			line-height: 14px;
			font-size: 13px;
			font-weight: 400;
			color: ${({ theme }) => theme.colors.text.secondary};
		}
	}

	@media ${({ theme }) => theme.breakpoints.md} {
		& > span {
			&:nth-child(1) {
				line-height: 24px;
				font-size: 19px;
			}
			&:nth-child(2) {
				line-height: 16px;
				font-size: 13px;
			}
		}
	}
`;

const TopBarBottom = styled.div`
	position: sticky;
	top: 52.5px;
	border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
	display: flex;
	align-items: center;
	height: 53px;
	background-color: rgba(0, 0, 0, 0.72);
	backdrop-filter: blur(12px);
	max-width: 600px;
	width: 100%;
	margin: 0 auto;
	z-index: 3;
`;
