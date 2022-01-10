import { IconButton as MuiIconButton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface Props {
	color?: "primary" | "secondary";
	Icon: any;
	onClick?: () => void;
	ariaLabel: string;
	size?: "small" | "medium" | "large";
	disableFocus?: boolean;
	isInTweetCard?: boolean;
}

const IconButton: React.FC<Props> = ({
	Icon,
	color,
	ariaLabel,
	onClick,
	children,
	size,
	disableFocus,
	isInTweetCard,
}) => {
	const [onHover, setOnHover] = useState<boolean>(false);
	const timeoutOnHoverRef = useRef(null);

	const handeOnHover = useCallback(() => {
		const timeout = setTimeout(() => setOnHover(true), 700);
		timeoutOnHoverRef.current = timeout;
	}, []);

	useEffect(() => {
		return () => clearTimeout(timeoutOnHoverRef.current);
	}, []);

	return (
		<StyledIconButton
			type="button"
			tabIndex={disableFocus ? -1 : 0}
			color={color ?? "primary"}
			aria-label={ariaLabel}
			onClick={onClick}
			size={size ?? "medium"}
			onMouseEnter={handeOnHover}
			onMouseLeave={() => {
				setOnHover(false);
				clearTimeout(timeoutOnHoverRef.current);
			}}
			isintweetcard={isInTweetCard}
		>
			{children}
			<Icon className="iconButton__icon" />
			<Tooltip isHidden={!onHover}>
				<span>{ariaLabel}</span>
			</Tooltip>
		</StyledIconButton>
	);
};

export default IconButton;

const StyledIconButton = styled(MuiIconButton)`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: ${({ size }) => (size === "small" ? " 30px" : "36px")};
	min-height: ${({ size }) => (size === "small" ? " 30px" : "36px")};
	border-radius: 50%;
	background-color: transparent;
	padding: 0;
	color: ${({ theme, color }) =>
		color === "primary"
			? theme.colors.text.primary
			: theme.colors.color.primary};
	font-size: ${({ size }) =>
		size === "small" ? "16px" : size === "large" ? "24px" : "20px"};

	& .iconButton__icon {
		font-size: ${({ size }) =>
			size === "small" ? "16px" : size === "large" ? "24px" : "20px"};
		color: ${({ theme, color, isintweetcard }) =>
			isintweetcard
				? theme.colors.text.secondary
				: color === "primary"
				? theme.colors.text.primary
				: theme.colors.color.primary};
	}

	&:hover {
		background-color: ${({ theme, color }) =>
			color === "primary"
				? theme.colors.hover.primary
				: theme.colors.hover.secondary};
	}
`;

const Tooltip = styled.div`
	display: ${({ isHidden }) => (isHidden ? "none" : "flex")};
	position: absolute;
	top: calc(100% + 1px);
	align-items: center;
	line-height: 11px;
	font-size: 11px;
	color: #fff;
	background-color: rgba(21, 24, 28, 0.9);
	overflow-wrap: break-word;
	white-space: nowrap;
	text-overflow: ellipsis;
	padding: 5px;
	border-radius: 3px;
	pointer-events: none;
	z-index: 3;

	${StyledIconButton}:focus-visible & {
		display: flex;
	}
`;
