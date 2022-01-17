import React, { useState } from "react";
import styled from "styled-components";
import TwitterIcon from "@mui/icons-material/Twitter";
import { AiOutlineHome } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { HiHashtag } from "react-icons/hi";
import { HiOutlineHashtag } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoNotificationsSharp } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import { IoMailSharp } from "react-icons/io5";
import { BsBookmark } from "react-icons/bs";
import { BsBookmarkFill } from "react-icons/bs";
import { RiFileList2Line } from "react-icons/ri";
import { RiFileList2Fill } from "react-icons/ri";
import { BsPerson } from "react-icons/bs";
import { BsPersonFill } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { RiSearch2Line } from "react-icons/ri";
import { RiSearch2Fill } from "react-icons/ri";
import { GiFeather } from "react-icons/gi";
import Link from "next/link";
import HeaderNavLink from "./headerNavLink";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AvatarProfile from "../profile/avatarProfile";
import { useUser } from "src/providers/userProvider";
import SkeletonLoader from "../loaders/skeletonLoader";
import { useRouter } from "next/router";
import { Button, CardActionArea } from "@mui/material";
import Modal from "../modal";
import CreateTweetForm from "../form/createTweetForm";
import { AnimateSharedLayout } from "framer-motion";

interface Props {}

const Header: React.FC<Props> = () => {
	const { user, loading, isLoggedOut, logout } = useUser();
	const { pathname, asPath } = useRouter();
	const [composeTweetModal, setComposeTweetModal] = useState<boolean>(false);

	const desktopNavMenu = [
		{
			title: "Home",
			href: "/home",
			ariaLabel: "Home page",
			icon: AiOutlineHome,
			secIcon: AiFillHome,
			active: pathname === "/home",
		},
		{
			title: "Explore",
			href: "/explore",
			ariaLabel: "Explore page",
			icon: HiOutlineHashtag,
			secIcon: HiHashtag,
			active: pathname === "/explore",
		},
		{
			title: "Notifications",
			href: "/notifications",
			ariaLabel: "Notifications page",
			icon: IoNotificationsOutline,
			secIcon: IoNotificationsSharp,
			active: pathname === "/notifications",
		},
		{
			title: "Messages",
			href: "/messages",
			ariaLabel: "Messages page",
			icon: IoMailOutline,
			secIcon: IoMailSharp,
			active: pathname === "/messages",
		},
		{
			title: "Bookmarks",
			href: "/bookmarks",
			ariaLabel: "Bookmarks page",
			icon: BsBookmark,
			secIcon: BsBookmarkFill,
			active: pathname === "/bookmarks",
		},
		{
			title: "Lists",
			href: "/lists",
			ariaLabel: "Lists page",
			icon: RiFileList2Line,
			secIcon: RiFileList2Fill,
			active: pathname === "/lists",
		},
		{
			title: "Profile",
			href: `/${user?.tag_name}`,
			ariaLabel: "Profile page",
			icon: BsPerson,
			secIcon: BsPersonFill,
			active: asPath.includes(
				`/${user?.tag_name}` ||
					`/${user?.tag_name}/with_replies` ||
					`/${user?.tag_name}/media` ||
					`/${user?.tag_name}/likes`
			),
		},
		{
			title: "More",
			ariaLabel: "More",
			icon: CgMoreO,
		},
	];
	const mobileNavMenu = [
		{
			title: "Home",
			href: "/home",
			ariaLabel: "Home page",
			icon: AiOutlineHome,
			secIcon: AiFillHome,
			active: pathname === "/home",
		},
		{
			title: "Explore",
			href: "/explore",
			ariaLabel: "Explore page",
			icon: RiSearch2Line,
			secIcon: RiSearch2Fill,
			active: pathname === "/explore",
		},
		{
			title: "Notifications",
			href: "/notifications",
			ariaLabel: "Notifications page",
			icon: IoNotificationsOutline,
			secIcon: IoNotificationsSharp,
			active: pathname === "/notifications",
		},
		{
			title: "Messages",
			href: "/messages",
			ariaLabel: "Messages page",
			icon: IoMailOutline,
			secIcon: IoMailSharp,
			active: pathname === "/messages",
		},
	];

	return (
		<>
			<HeaderContainer>
				<AnimateSharedLayout>
					<Modal
						isOpen={composeTweetModal}
						onClose={() => setComposeTweetModal(false)}
						toTop
						shouldCloseOutside
					>
						<CreateTweetForm
							isInModal
							onCloseModal={() => setComposeTweetModal(false)}
						/>
					</Modal>
				</AnimateSharedLayout>
				<Inner>
					<LogoWrapper>
						<Logo>
							<Link href="/home">
								<a tabIndex={0} aria-label="Logo">
									<TwitterIcon className="header__logo" />
								</a>
							</Link>
						</Logo>
					</LogoWrapper>
					<DesktopNavList>
						{desktopNavMenu.map((item, i) => (
							<HeaderNavLink
								key={`${item.title}-${i}`}
								href={item.href && item.href}
								title={item.title}
								Icon={item.active && item.active ? item.secIcon : item.icon}
								ariaLabel={item.ariaLabel}
								isActive={item.active && item.active}
							/>
						))}
						<ComposeTweetContainer>
							<ComposeTweetButton
								onClick={() => setComposeTweetModal((prev) => !prev)}
							>
								<GiFeather className="header__composeTweetButtonIcon" />
								<span className="header__ComposeTweetButtonSpan">Tweet</span>
							</ComposeTweetButton>
						</ComposeTweetContainer>
					</DesktopNavList>
					{!isLoggedOut ? (
						<ProfileRow>
							<ProfileRowInner component="div">
								<ProfileRowInnerColumn>
									<AvatarProfile
										loading={loading}
										src={user?.profile_image_url ?? ""}
										userTagName={user?.tag_name ?? "Loading"}
										link={false}
									/>
								</ProfileRowInnerColumn>
								<ProfileRowInnerColumn>
									{loading ? (
										<>
											<span style={{ marginBottom: "8px" }}>
												<SkeletonLoader height={11} width={80} />
											</span>
											<span>
												<SkeletonLoader height={11} width={85} />
											</span>
										</>
									) : (
										<>
											<span>{user.name}</span>
											<span>{`@${user.tag_name}`}</span>
										</>
									)}
								</ProfileRowInnerColumn>
								<ProfileRowInnerColumn>
									<MoreHorizIcon
										onClick={logout}
										className="header__profileRowInnerColumnMoreIcon"
									/>
								</ProfileRowInnerColumn>
							</ProfileRowInner>
						</ProfileRow>
					) : null}

					<MobileNavList>
						{mobileNavMenu.map((item, i) => (
							<MobileNavLinkWrapper key={`${item.title}-${i}`}>
								<HeaderNavLink
									href={item.href}
									title={item.title}
									Icon={item.active && item.active ? item.secIcon : item.icon}
									ariaLabel={item.ariaLabel}
								/>
							</MobileNavLinkWrapper>
						))}
					</MobileNavList>
					<MobileComposeTweetContainer>
						<ComposeTweetButton
							onClick={() => setComposeTweetModal((prev) => !prev)}
						>
							<GiFeather className="header__composeTweetButtonIcon" />
							<span className="header__ComposeTweetButtonSpan">Tweet</span>
						</ComposeTweetButton>
					</MobileComposeTweetContainer>
				</Inner>
			</HeaderContainer>
		</>
	);
};

export default Header;

const HeaderContainer = styled.header`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	width: 100%;
	background-color: ${({ theme }) => theme.colors.background.primary};
	border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
	height: 50px;
	z-index: 900;

	@media ${({ theme }) => theme.breakpoints.md} {
		position: sticky;
		top: 0;
		bottom: 0;
		border: none;
		z-index: 1;
		max-width: 88px;
		height: 100vh;
	}
	@media screen and (min-width: 1290px) {
		max-width: 270px;
	}
`;

const Inner = styled.div`
	display: flex;
	width: 100%;
	height: 100%;

	@media ${({ theme }) => theme.breakpoints.md} {
		display: flex;
		padding: 0 12px;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
`;

const LogoWrapper = styled.div`
	display: none;

	@media ${({ theme }) => theme.breakpoints.md} {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2px 0;
		height: 60px;
		margin-top: 2px;
	}

	@media screen and (min-width: 1290px) {
		justify-content: flex-start;
	}
`;

const Logo = styled.div`
	display: flex;

	& > a {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		height: 50px;
		width: 50px;
		cursor: pointer;
		transition: background 0.2s;

		& .header__logo {
			font-size: 30px;
			fill: ${({ theme }) => theme.colors.text.primary};
		}

		&:hover {
			background: ${({ theme }) => theme.colors.hover.secondary};
		}
	}

	@media ${({ theme }) => theme.breakpoints.md} {
		& > a > .header__logo {
			font-size: 35px;
			fill: ${({ theme }) => theme.colors.text.primary};
		}
	}
`;

const DesktopNavList = styled.nav`
	display: none;

	@media ${({ theme }) => theme.breakpoints.md} {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	@media screen and (min-width: 1290px) {
		align-items: flex-start;
	}
`;

const MobileNavList = styled.nav`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	flex-grow: 1;

	@media ${({ theme }) => theme.breakpoints.md} {
		display: none;
	}
`;

const MobileNavLinkWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 150px;
	width: 100%;
`;

const ComposeTweetContainer = styled.div`
	display: flex;
	justify-content: center;
	margin: 16px 0;
	width: 90%;
`;

const ComposeTweetButton = styled(Button)`
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${({ theme }) => theme.colors.color.primary};
	color: #fff;
	font-size: 17px;
	font-weight: 700;
	line-height: 20px;
	text-transform: none;
	overflow-wrap: break-word;
	min-height: 56px;
	min-width: 56px;
	border-radius: 50px;
	box-shadow: rgb(217 217 217 / 20%) 0px 0px 5px,
		rgb(217 217 217 / 25%) 0px 1px 4px 1px;

	& > .header__composeTweetButtonIcon {
		display: block;
		fill: #fff;
		font-size: 28px;
	}

	& .header__ComposeTweetButtonSpan {
		display: none;
	}

	&:hover {
		background: ${({ theme }) => theme.colors.focus.secondary};
	}

	@media ${({ theme }) => theme.breakpoints.md} {
		min-height: 52px;
		min-width: 52px;
		box-shadow: rgb(0 0 0 / 8%) 0px 8px 28px;

		& > .header__composeTweetButtonIcon {
			font-size: 24px;
		}
	}

	@media screen and (min-width: 1290px) {
		width: 100%;

		& > .header__composeTweetButtonIcon {
			display: none;
		}

		& .header__ComposeTweetButtonSpan {
			display: inline-block;
		}
	}
`;

const MobileComposeTweetContainer = styled.div`
	display: flex;
	position: fixed;
	bottom: 70px;
	right: 20px;
	z-index: 10;

	@media ${({ theme }) => theme.breakpoints.md} {
		display: none;
	}
`;

const ProfileRow = styled.div`
	display: none;

	@media ${({ theme }) => theme.breakpoints.md} {
		display: flex;
		margin: 12px 0;
		width: 100%;
		margin-top: auto;
	}
`;

const ProfileRowInner = styled(CardActionArea)`
	display: flex;
	align-items: center;
	border-radius: 50px;
	padding: 12px;
	width: 100%;
	transition: background 0.2s;
	cursor: pointer;

	&:hover {
		background: ${({ theme }) => theme.colors.hover.primary};
	}
`;

const ProfileRowInnerColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	font-size: 15px;

	&:nth-child(2) {
		display: none;
	}
	&:nth-child(3) {
		display: none;
	}

	& > span {
		overflow-wrap: break-word;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 20px;
		color: ${({ theme }) => theme.colors.text.primary};
		user-select: none;
	}

	& > span:nth-child(1) {
		font-weight: 700;
	}
	& > span:nth-child(2) {
		font-weight: 400;
		color: ${({ theme }) => theme.colors.text.secondary};
	}

	@media screen and (min-width: 1290px) {
		&:nth-child(2) {
			display: flex;
			margin: 0 12px;
		}
		&:nth-child(3) {
			display: flex;
			align-items: flex-end;
			flex-grow: 1;

			& > .header__profileRowInnerColumnMoreIcon {
				font-size: 19px;
			}
		}
	}
`;
