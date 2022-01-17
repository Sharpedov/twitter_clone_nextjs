import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import IconButton from "../iconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useUser } from "src/providers/userProvider";
import AvatarProfile from "../profile/avatarProfile";
import { ButtonBase } from "@mui/material";
import Link from "next/link";
import { BsPerson } from "react-icons/bs";
import { RiFileList2Line } from "react-icons/ri";
import { BsBookmark } from "react-icons/bs";
import { DisableScrollbar } from "src/utils/disableScrollbar";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const backdropVariants = {
	hidden: {
		opacity: 0,
	},
	show: {
		opacity: 1,
	},
};

const containerVariants = {
	hidden: {
		x: "-100%",
		transition: { duration: 0.15 },
	},
	show: {
		x: "0",
		transition: { duration: 0.25 },
	},
};

const MobileNavDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
	const { user, isLogged, logout } = useUser();
	DisableScrollbar(isOpen);

	const mobileNavDrawerMenu = [
		{
			text: "Profile",
			href: `/${user?.tag_name}`,
			ariaLabel: "Profile page",
			icon: BsPerson,
		},
		{
			text: "Lists",
			href: "/lists",
			ariaLabel: "Lists page",
			icon: RiFileList2Line,
		},
		{
			text: "Bookmarks",
			href: "/bookmarks",
			ariaLabel: "Bookmarks page",
			icon: BsBookmark,
		},
	];

	if (!isLogged) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<Backdrop
						variants={backdropVariants}
						initial="hidden"
						animate="show"
						exit="hidden"
						onClick={onClose}
					/>
					<Container
						variants={containerVariants}
						initial="hidden"
						animate="show"
						exit="hidden"
						transition="transition"
					>
						<Header>
							<span>Info about account</span>
							<IconButton
								onClick={onClose}
								Icon={CloseRoundedIcon}
								ariaLabel="Close"
							/>
						</Header>
						<Body>
							<Link href={`/${user.tag_name}`} passHref>
								<ProfileInfo>
									<ProfileInfoCol1>
										<AvatarProfile
											src={user.profile_image_url}
											userTagName={user.tag_name}
											loading={false}
											link={false}
											size={38}
										/>
									</ProfileInfoCol1>
									<ProfileInfoCol2>
										<span>{user.name}</span>
										<span>{`@${user.tag_name}`}</span>
									</ProfileInfoCol2>
								</ProfileInfo>
							</Link>
							<FollowsRow>
								<Link href={`/${user.tag_name}/following`} passHref>
									<a>
										<div>
											<span>{user.following_count}</span> <span>Following</span>
										</div>
									</a>
								</Link>
								<Link href={`/${user.tag_name}/followers`} passHref>
									<a>
										<div>
											<span>{user.followers_count}</span> <span>Followers</span>
										</div>
									</a>
								</Link>
							</FollowsRow>
							{mobileNavDrawerMenu.map((item, i) => (
								<Link key={item.text} href={item.href} passHref>
									<DrawerItem>
										<item.icon className="mobileNavDrawer__drawerItemIcon" />
										<span>{item.text}</span>
									</DrawerItem>
								</Link>
							))}
							<Break />
							<DrawerItem onClick={logout}>
								<span>Log out</span>
							</DrawerItem>
						</Body>
					</Container>
				</>
			)}
		</AnimatePresence>
	);
};

export default MobileNavDrawer;

const Backdrop = styled(motion.div)`
	position: fixed;
	inset: 0px;
	background-color: rgba(91, 112, 131, 0.4);
	z-index: 900;
`;

const Container = styled(motion.div)`
	position: fixed;
	top: 0px;
	bottom: 0px;
	left: 0px;
	display: flex;
	flex-direction: column;
	background-color: ${({ theme }) => theme.colors.background.primary};
	max-width: 280px;
	width: 100%;
	height: 100vh;
	box-shadow: rgb(217 217 217 / 20%) 0px 0px 5px,
		rgb(217 217 217 / 25%) 0px 1px 4px 1px;
	z-index: 900;
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0 10px;
	height: 50px;
	width: 100%;
	padding: 0 15px;
	margin: 0 auto;

	& > span {
		font-size: 15.5px;
		font-weight: 700;
		line-height: 19px;
		overflow-wrap: break-word;
		min-width: 0px;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

const Body = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;

const ProfileInfo = styled(ButtonBase)`
	margin-top: 11px;
	display: flex;
	height: 49px;
	width: 100%;
	align-items: center;
	text-align: left;
	justify-content: flex-start;
	padding: 0 11px;
	font-family: ${({ theme }) => theme.fonts.main};
	transition: background-color 0.2s ease;

	&:hover {
		background-color: rgba(255, 255, 255, 0.03);
	}
`;

const ProfileInfoCol1 = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-width: 55px;
`;

const ProfileInfoCol2 = styled.div`
	display: flex;
	flex-direction: column;

	& > span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		overflow-wrap: break-word;
		font-size: 13.5px;
		line-height: 19px;

		white-space: nowrap;
		&:nth-child(1) {
			font-weight: 700;
			color: ${({ theme }) => theme.colors.text.primary};
		}
		&:nth-child(2) {
			font-weight: 400;
			color: ${({ theme }) => theme.colors.text.secondary};
		}
	}
`;

const FollowsRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	padding: 12px 16px;

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

const DrawerItem = styled(ButtonBase)`
	display: flex;
	padding: 16px;
	align-items: center;
	justify-content: flex-start;

	& .mobileNavDrawer__drawerItemIcon {
		margin-right: 12px;
		font-size: 18.75px;
	}

	& > span {
		font-weight: 400;
		font-size: 15px;
		line-height: 20px;
		overflow-wrap: break-word;
		font-family: ${({ theme }) => theme.fonts.main};
	}

	&:hover {
		background-color: rgba(255, 255, 255, 0.03);
	}
`;

const Break = styled.div`
	height: 1px;
	width: 100%;
	background-color: ${({ theme }) => theme.colors.border.primary};
	margin: 1px 0;
`;
