import React, { useState } from "react";
import styled from "styled-components";
import LinearLoader from "./loaders/linearLoader";
import { motion } from "framer-motion";
import AvatarProfile from "./profile/avatarProfile";
import { useUser } from "src/providers/userProvider";
import MobileNavDrawer from "src/components/drawers/mobileNavDrawer";

interface Props {
	loading?: boolean;
	text?: string;
	animatedLayout?: boolean;
}

const TopBarMobile: React.FC<Props> = ({
	children,
	text,
	loading,
	animatedLayout = false,
}) => {
	const { user, loading: userLoading } = useUser();
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

	return (
		<>
			<MobileNavDrawer
				isOpen={drawerOpen}
				onClose={() => setDrawerOpen(false)}
			/>
			<StyledTopBarMobile layout={animatedLayout}>
				<LinearLoader loading={loading} />
				<ProfileImgWrapper>
					<AvatarProfile
						src={user.profile_image_url}
						userTagName={user.tag_name}
						loading={userLoading}
						link={false}
						size={30}
						onClick={() => setDrawerOpen(true)}
					/>
				</ProfileImgWrapper>
				{text && <SpanText layout={animatedLayout}>{text}</SpanText>}
				{children}
			</StyledTopBarMobile>
		</>
	);
};

export default TopBarMobile;

const StyledTopBarMobile = styled(motion.div)`
	position: sticky;
	top: -0px;
	display: flex;
	align-items: center;
	height: 50px;
	background-color: rgba(0, 0, 0, 0.72);
	backdrop-filter: blur(12px);
	max-width: 600px;
	width: 100%;
	margin: 0 auto;
	padding: 0 15px;
	z-index: 3;

	@media ${({ theme }) => theme.breakpoints.md} {
		display: none;
	}
`;

const ProfileImgWrapper = styled.div`
	display: flex;
	min-width: 53px;
	min-height: 30px;
	align-self: stretch;
	align-items: flex-start;
	flex-direction: column;
	justify-content: center;
`;

const SpanText = styled(motion.span)`
	margin-left: 22px;
	line-height: 20px;
	font-size: 16px;
	font-weight: 700;
	flex-grow: 1;
	margin-right: 10px;

	@media ${({ theme }) => theme.breakpoints.md} {
		margin-left: 22px;
		line-height: 24px;
		font-size: 19px;
		font-weight: 700;
		flex-grow: 1;
		margin-right: 10px;
	}
`;
