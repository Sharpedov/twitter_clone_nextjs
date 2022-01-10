import { Button } from "@mui/material";
import React, { useMemo, useState } from "react";
import styled from "styled-components";

interface Props {
	children: React.ReactNode;
	onClick?: () => void;
	variant?: "contained" | "outlined" | "unfollow";
	disabled?: boolean;
	size?: "small" | "medium" | "large";
	fullWidth?: boolean;
	type?: "submit" | "button";
	color?: "primary" | "secondary";
	className?: string;
}
type RefType = HTMLDivElement;

const CustomButton = React.forwardRef(
	(
		{
			children,
			disabled,
			onClick,
			size,
			fullWidth,
			type,
			color = "primary",
			variant,
			className,
		}: Props,
		ref: React.ForwardedRef<RefType>
	) => {
		const [unfollowButtonHover, setUnfollowButtonHover] =
			useState<boolean>(false);

		const ButtonElement = useMemo(() => {
			switch (variant) {
				case "outlined": {
					return (
						<StyledOutlinedButton
							ref={ref}
							className={className}
							type={type}
							variant="outlined"
							disabled={disabled}
							onClick={onClick}
							size={size ?? "medium"}
							fullWidth={fullWidth}
							color={color ?? "primary"}
						>
							{children}
						</StyledOutlinedButton>
					);
				}
				case "unfollow": {
					return (
						<StyledUnfollowButton
							ref={ref}
							className={className}
							type={type}
							variant="outlined"
							disabled={disabled}
							onClick={onClick}
							size={size ?? "medium"}
							fullWidth={fullWidth}
							color={color ?? "primary"}
							onMouseEnter={() => setUnfollowButtonHover(true)}
							onMouseLeave={() => setUnfollowButtonHover(false)}
						>
							{unfollowButtonHover ? "Unfollow" : children}
						</StyledUnfollowButton>
					);
				}
				default:
					return (
						<StyledContainedButton
							ref={ref}
							className={className}
							type={type}
							variant={variant ?? "contained"}
							disabled={disabled}
							onClick={onClick}
							size={size ?? "medium"}
							fullWidth={fullWidth}
							color={color ?? "primary"}
						>
							{children}
						</StyledContainedButton>
					);
			}
		}, [
			type,
			variant,
			disabled,
			onClick,
			size,
			fullWidth,
			color,
			children,
			className,
			unfollowButtonHover,
			ref,
		]);

		return ButtonElement;
	}
);

export default CustomButton;

CustomButton.displayName = "CustomButton";

const StyledButton = styled(Button)`
	background-color: ${({ theme, color }) =>
		color === "primary"
			? theme.colors.button.primary
			: theme.colors.button.secondary};
	color: ${({ color }) => (color === "primary" ? "#fff" : "rgb(15, 20, 25)")};
	font-size: 14px;
	font-weight: 500;
	text-transform: none;
	line-height: 20px;
	overflow-wrap: break-word;
	border-radius: 50px;
	min-width: 36px;
	height: ${({ size }) =>
		size === "large" ? "42px" : size === "small" ? "32px" : "36px"};
	padding: 0 16px;
	max-width: ${({ fullWidth }) => (fullWidth ? "100%" : "300px")};
	transition: all 0.2s ease;

	&:hover {
		background-color: ${({ theme, color }) =>
			color === "primary"
				? theme.colors.button.primary
				: theme.colors.button.secondary};
		filter: brightness(0.9);
	}

	&:disabled {
		background-color: ${({ theme, color }) =>
			color === "primary"
				? theme.colors.button.primary
				: theme.colors.button.secondary};
		color: ${({ color }) => (color === "primary" ? "#fff" : "rgb(15, 20, 25)")};
		opacity: 0.5;
	}
`;

const StyledContainedButton = styled(StyledButton)``;

const StyledOutlinedButton = styled(StyledButton)`
	background-color: transparent;
	color: #fff;
	border-color: rgb(83, 100, 113);

	&:hover {
		background-color: rgba(255, 255, 255, 0.15);
		border-color: rgb(83, 100, 113);
	}

	&:disabled {
		background-color: transparent;
		color: #fff;
		opacity: 1;
		border-color: rgb(83, 100, 113);
		opacity: 0.5;
	}
`;

const StyledUnfollowButton = styled(StyledOutlinedButton)`
	&:hover {
		border-color: rgba(255, 0, 0, 0.5);
		background-color: rgba(255, 0, 0, 0.15);
		color: rgba(255, 0, 0, 0.9);
	}
`;
