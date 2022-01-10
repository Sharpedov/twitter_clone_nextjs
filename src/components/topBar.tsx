import React from "react";
import styled from "styled-components";
import IconButton from "./iconButton";
import LinearLoader from "./loaders/linearLoader";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { motion } from "framer-motion";

interface Props {
	loading?: boolean;
	Icon?: any;
	onClose?: () => void;
	text?: string;
	withoutIcon?: boolean;
	iconAriaLabel?: string;
	animatedLayout?: boolean;
}

const TopBar: React.FC<Props> = ({
	children,
	text,
	Icon,
	loading,
	onClose,
	withoutIcon,
	iconAriaLabel,
	animatedLayout = false,
}) => {
	return (
		<StyledTopBar layout={animatedLayout}>
			<LinearLoader loading={loading} />
			{!withoutIcon && (
				<motion.div layout={animatedLayout} style={{ marginLeft: "-8px" }}>
					<IconButton
						Icon={Icon ?? CloseRoundedIcon}
						ariaLabel={iconAriaLabel ?? "Close"}
						size="medium"
						onClick={onClose}
					/>
				</motion.div>
			)}
			{text && <SpanText layout={animatedLayout}>{text}</SpanText>}
			{children}
		</StyledTopBar>
	);
};

export default TopBar;

const StyledTopBar = styled(motion.div)`
	position: sticky;
	top: -0px;
	display: flex;
	align-items: center;
	height: 53px;
	background-color: rgba(0, 0, 0, 0.72);
	backdrop-filter: blur(12px);
	max-width: 600px;
	width: 100%;
	margin: 0 auto;
	padding: 0 16px;
	z-index: 3;
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
