import React, { useCallback, useRef, useState } from "react";
import { UserType } from "src/types";
import styled from "styled-components";
import CustomButton from "../button";
import AvatarProfile from "../profile/avatarProfile";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { followUser, unfollowUser } from "src/store/slices/userSlice";

interface Props {
	followUserData: UserType;
	userId: string;
	mutate: any;
}

const FollowedUserCard: React.FC<Props> = ({
	followUserData,
	userId,
	mutate,
}) => {
	const {
		tag_name,
		name,
		description,
		profile_image_url,
		isFollowed,
		isFollowsYou,
	} = followUserData;
	const { push } = useRouter();
	const [followUserLoading, setFollowUserLoading] = useState<boolean>(false);
	const [unfollowUserLoading, setUnfollowUserLoading] =
		useState<boolean>(false);
	const dispatch = useDispatch();
	const myProfile = userId === followUserData._id;
	const followButtonRef = useRef(null!);

	const handleFollowUser = useCallback(async () => {
		if (!myProfile) {
			setFollowUserLoading(true);
			await dispatch(
				followUser({ tag_name, profile_id: userId, onComplete: () => mutate() })
			);
			setFollowUserLoading(false);
		}
	}, [dispatch, tag_name, userId, myProfile, mutate]);

	const handleUnfollowUser = useCallback(async () => {
		if (!myProfile) {
			setUnfollowUserLoading(true);
			await dispatch(
				unfollowUser({
					tag_name,
					profile_id: userId,
					onComplete: () => mutate(),
				})
			);
			setUnfollowUserLoading(false);
		}
	}, [dispatch, tag_name, userId, myProfile, mutate]);

	return (
		<Container
			role="button"
			tabIndex={0}
			onKeyPress={(e) => e.key === "Enter" && push(`/${tag_name}`)}
			onClick={(e) =>
				e.target !== followButtonRef.current && push(`/${tag_name}`)
			}
		>
			<Inner>
				<ColLeft>
					<AvatarProfile
						src={profile_image_url}
						userTagName={tag_name}
						loading={false}
						size={48}
					/>
				</ColLeft>
				<ColRight>
					<ColRightRow1>
						<UserNameAndTagName>
							<span>{name}</span>
							<span style={{ display: "flex" }}>
								{`@${tag_name}`}
								{isFollowsYou && (
									<FollowsYouBadge>
										<span>Follows you</span>
									</FollowsYouBadge>
								)}
							</span>
						</UserNameAndTagName>
						{!myProfile &&
							(isFollowed ? (
								<CustomButton
									ref={followButtonRef}
									className="appear"
									disabled={unfollowUserLoading}
									color="secondary"
									variant="unfollow"
									onClick={handleUnfollowUser}
								>
									Following
								</CustomButton>
							) : (
								<CustomButton
									ref={followButtonRef}
									className="appear"
									disabled={followUserLoading}
									color="secondary"
									onClick={handleFollowUser}
								>
									Follow
								</CustomButton>
							))}
					</ColRightRow1>
					{description && (
						<ColRightRow2>
							<span>{description}</span>
						</ColRightRow2>
					)}
				</ColRight>
			</Inner>
		</Container>
	);
};

export default FollowedUserCard;

const Container = styled.div`
	display: flex;
	padding: 16px 12px;
	transition: background-color 0.2s ease, box-shadow 0.2s ease;
	outline: none;
	cursor: pointer;

	&:focus-visible {
		box-shadow: rgb(199, 230, 252) 0px 0px 0px 2px inset;
		background-color: rgba(255, 255, 255, 0.08);
	}

	&:hover {
		background-color: rgba(255, 255, 255, 0.03);
	}
	&:active {
		background-color: rgba(255, 255, 255, 0.06);
	}
`;

const Inner = styled.div`
	display: flex;
	width: 100%;
`;

const ColLeft = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-basis: 48px;
	margin-right: 12px;
`;

const ColRight = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;

const ColRightRow1 = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const UserNameAndTagName = styled.div`
	display: flex;
	flex-direction: column;

	& > span {
		white-space: nowrap;
		overflow-wrap: break-word;
		overflow: hidden;
		font-size: 15px;
		line-height: 20px;
		&:nth-child(1) {
			color: ${({ theme }) => theme.colors.text.primary};
			font-weight: 700;
		}
		&:nth-child(2) {
			color: ${({ theme }) => theme.colors.text.secondary};
			font-weight: 400;
		}
	}
`;

const FollowsYouBadge = styled.div`
	display: flex;
	align-items: center;
	margin-left: 4px;
	line-height: 16px;
	font-size: 12.5px;
	font-weight: 400;
	overflow-wrap: break-word;
	border-radius: 4px;
	padding: 0 4px;
	background-color: rgb(32, 35, 39);
`;

const ColRightRow2 = styled.div`
	display: flex;
	padding-top: 4px;
	font-weight: 400;
	font-size: 15px;
	line-height: 20px;
	overflow-wrap: break-word;
`;
