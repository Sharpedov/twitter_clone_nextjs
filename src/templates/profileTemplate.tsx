import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SkeletonLoader from "src/components/loaders/skeletonLoader";
import { Avatar } from "@mui/material";
import CustomButton from "src/components/button";
import { BiCalendar } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";
import Modal from "src/components/modal";
import { BsLink45Deg } from "react-icons/bs";
import EditProfile from "src/components/profile/editProfile";
import moment from "moment";
import TopBar from "src/components/topBar";
import { UserType } from "src/types";
import Feed from "src/components/feed";
import Widgets from "src/components/widgets";
import ScrollSnapList from "src/components/scrollSnapList";
import { useUser } from "src/providers/userProvider";
import useSWR from "swr";
import { fetcher } from "src/utils/fetcher";
import { useDispatch } from "react-redux";
import { followUser, unfollowUser } from "src/store/slices/userSlice";
import Link from "next/link";

interface Props {}

interface UserData extends UserType {
	loading: boolean;
	myProfile: boolean;
}

const ProfileTemplate: React.FC<Props> = ({ children }) => {
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
	const [editProfileModal, setEditProfileModal] = useState(false);
	const dispatch = useDispatch();

	const userData: UserData = useMemo(() => {
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
			text: "Tweets",
			href: `/${query.tagName}`,
			active: pathname === "/[tagName]",
		},
		{
			text: "Tweets & replies",
			href: `/${query.tagName}/with_replies`,
			active: pathname === "/[tagName]/with_replies",
		},
		{
			text: "Media",
			href: `/${query.tagName}/media`,
			active: pathname === "/[tagName]/media",
		},
		{
			text: "Likes",
			href: `/${query.tagName}/likes`,
			active: pathname === "/[tagName]/likes",
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
			<Modal
				isOpen={editProfileModal}
				onClose={() => setEditProfileModal(false)}
				shouldCloseOutside
			>
				<EditProfile onClose={() => setEditProfileModal(false)} />
			</Modal>

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
									<span className="appear">
										{`${userData.tweet_count} tweets` ?? "0 tweets"}
									</span>
								</>
							)}
						</TopBarInnerColumn>
					</TopBarInner>
				</TopBar>
				<ProfileBanner loading={userData.loading}>
					<ProfileBannerInner>
						{userData.loading ? (
							<SkeletonLoader absolute radiusNone />
						) : (
							<ProfileBannerInnerPic
								className="appear"
								bannerUrl={userData.profile_banner_url}
							/>
						)}
					</ProfileBannerInner>
				</ProfileBanner>
				<ProfileInfo>
					<ProfileRow1>
						<ProfileImage>
							<div style={{ paddingBottom: "100%" }} />
							<ProfileImageInner>
								{userData.loading ? (
									<div style={{ paddingBottom: "100%" }}>
										<SkeletonLoader absolute variant="circular" />
									</div>
								) : (
									<ProfileImageInnerPic
										className="appear"
										src={userData.profile_image_url}
										alt={userData.tag_name}
										aria-label={userData.tag_name}
									>
										{!userData.profile_image_url && userData.tag_name[0]}
									</ProfileImageInnerPic>
								)}
							</ProfileImageInner>
						</ProfileImage>
						<div style={{ marginBottom: "12px" }}>
							{userData.loading ? (
								<SkeletonLoader width={110} height={36} />
							) : userData.myProfile ? (
								<CustomButton
									className="appear"
									color="secondary"
									variant="outlined"
									onClick={() => setEditProfileModal((prev) => !prev)}
									disabled={userData.loading}
								>
									Edit profile
								</CustomButton>
							) : userData.isFollowed ? (
								<CustomButton
									className="appear"
									disabled={userData.loading || unfollowUserLoading}
									color="secondary"
									variant="unfollow"
									onClick={handleUnfollowUser}
								>
									Following
								</CustomButton>
							) : (
								<CustomButton
									className="appear"
									disabled={userData.loading || followUserLoading}
									color="secondary"
									onClick={handleFollowUser}
								>
									Follow
								</CustomButton>
							)}
						</div>
					</ProfileRow1>
					<ProfileRow2>
						{userData.loading ? (
							<>
								<span style={{ marginBottom: "7px", marginTop: "2px" }}>
									<SkeletonLoader width={150} height={19} />
								</span>
								<span>
									<SkeletonLoader width={125} height={14} />
								</span>
							</>
						) : (
							<>
								<span className="appear">{userData.name}</span>
								<span className="appear">{`@${userData.tag_name}`}</span>
							</>
						)}
					</ProfileRow2>

					{userData.loading ? (
						<div style={{ marginBottom: "11px" }}>
							<SkeletonLoader width={150} height={20} />
						</div>
					) : (
						!!userData.description && (
							<ProfileRow3 className="appear">
								{userData.description}
							</ProfileRow3>
						)
					)}
					<ProfileRow4>
						<ProfileRowInner>
							{userData.loading ? (
								<>
									<span>
										<SkeletonLoader width={250} height={17.5} />
									</span>
									<span>
										<SkeletonLoader width={250} height={17.5} />
									</span>
									<span>
										<SkeletonLoader width={250} height={17.5} />
									</span>
								</>
							) : (
								<>
									{!!userData.location && (
										<span className="appear">
											<IoLocationOutline className="profilePage__profileRowInnerIcon" />
											<span>{userData.location}</span>
										</span>
									)}

									{!!userData.url && (
										<span className="appear">
											<BsLink45Deg className="profilePage__profileRowInnerIcon" />
											<a
												target="_blank"
												href={userData.url}
												rel="noopener noreferrer"
											>
												<span>{userData.url}</span>
											</a>
										</span>
									)}
									<span className="appear">
										<BiCalendar className="profilePage__profileRowInnerIcon" />
										<span>
											Joined{" "}
											{moment(userData.createdAt).format("LL").toLowerCase()}
										</span>
									</span>
								</>
							)}
						</ProfileRowInner>
					</ProfileRow4>
					<ProfileRow5>
						{userData.loading ? (
							<>
								<div>
									<SkeletonLoader height={19} width={90} />
								</div>
								<div>
									<SkeletonLoader height={19} width={90} />
								</div>
							</>
						) : (
							<>
								<Link href={`/${userData.tag_name}/following`} passHref>
									<a>
										<div className="appear">
											<span>{userData.following_count}</span>{" "}
											<span>Following</span>
										</div>
									</a>
								</Link>
								<Link href={`/${userData.tag_name}/followers`} passHref>
									<a>
										<div className="appear">
											<span>{userData.followers_count}</span>{" "}
											<span>Followers</span>
										</div>
									</a>
								</Link>
							</>
						)}
					</ProfileRow5>
				</ProfileInfo>
				{!userData.loading && <ScrollSnapList list={scrollSnapList} />}
				{childrenWithProps}
			</Feed>

			<Widgets />
		</>
	);
};

export default ProfileTemplate;

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

const ProfileBanner = styled.div`
	display: block;
	background-color: ${({ loading }) => !loading && "rgb(47, 51, 54)"};
	overflow: hidden;
`;

const ProfileBannerInner = styled.div`
	position: relative;
	display: block;
	padding-bottom: 33.3333%;
	width: 100%;
`;

const ProfileBannerInnerPic = styled.div`
	position: absolute;
	top: 0px;
	bottom: 0px;
	right: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background-image: ${({ bannerUrl }) => `url(${bannerUrl})`};
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center center;
`;

const ProfileInfo = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	padding: 12px 16px 0;
	margin-bottom: 16px;
`;

const ProfileRow1 = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 5px;
`;

const ProfileImage = styled.div`
	position: relative;
	display: block;
	width: 24%;
	min-width: 48px;
	margin-top: -15%;
	margin-bottom: 12px;
`;

const ProfileImageInner = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0px;
	left: 0px;
	bottom: 0px;
	display: grid;
	place-items: center;
	background-color: rgb(45, 49, 51);
	border-radius: 50%;

	&::before {
		content: "";
		position: absolute;
		inset: 0px;
		transform: translate(-2px, -2px);
		border-radius: 50%;
		height: calc(100% + 4px);
		width: calc(100% + 4px);
		border: 2px solid #000;
	}
`;

const ProfileImageInnerPic = styled(Avatar)`
	box-shadow: rgba(255, 255, 255, 0.03) 0px 0px 2px inset;
	height: 100%;
	width: 100%;
	font-size: clamp(20px, 5vw, 50px);
	background-color: rgb(45, 49, 51);
`;

const ProfileRow2 = styled.div`
	display: flex;
	flex-direction: column;
	margin: 4px 0 11px;

	& > span {
		overflow-wrap: break-word;
		&:nth-child(1) {
			line-height: 23px;
			font-size: 19px;
			color: ${({ theme }) => theme.colors.text.primary};
			font-weight: 700;
		}
		&:nth-child(2) {
			line-height: 19px;
			font-size: 14px;
			color: ${({ theme }) => theme.colors.text.secondary};
			font-weight: 400;
		}
	}
`;

const ProfileRow3 = styled.div`
	display: block;
	margin-bottom: 11px;
	font-size: 15px;
	font-weight: 400;
	line-height: 20px;
	overflow-wrap: break-word;
`;

const ProfileRow4 = styled.div`
	display: block;
	margin-bottom: 11px;
`;

const ProfileRowInner = styled.div`
	display: inline;
	line-height: 11px;
	font-weight: 400;
	font-size: 14px;
	overflow-wrap: break-word;
	white-space: pre-wrap;
	color: ${({ theme }) => theme.colors.text.secondary};

	& > span {
		display: inline-flex;
		vertical-align: middle;
		align-items: center;
		margin-right: 11px;
		overflow-wrap: break-word;

		& > a {
			color: ${({ theme }) => theme.colors.color.primary};

			&:hover {
				text-decoration: underline;
			}
		}

		& .profilePage__profileRowInnerIcon {
			font-size: 1.25em;
			margin-right: 4px;
		}
	}
`;

const ProfileRow5 = styled.div`
	display: flex;
	flex-wrap: wrap;

	& > a > div {
		margin-right: 19px;
		cursor: pointer;
		font-weight: 400;
		font-size: 14px;
		line-height: 19px;
		overflow-wrap: break-word;
		color: ${({ theme }) => theme.colors.text.primary};

		& > span {
			&:nth-child(2) {
				color: ${({ theme }) => theme.colors.text.secondary};
			}
		}

		&:hover {
			text-decoration: underline;
		}
	}
`;
