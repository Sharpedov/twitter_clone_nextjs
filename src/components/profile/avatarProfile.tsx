import { Avatar } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import SkeletonLoader from "../loaders/skeletonLoader";
import Link from "next/link";

interface Props {
	src: string;
	size?: number;
	onClick?: () => void;
	loading: boolean;
	userTagName: string;
	link?: boolean;
}

const AvatarProfile: React.FC<Props> = ({
	src,
	size,
	loading,
	userTagName,
	link = true,
	onClick,
}) => {
	return loading ? (
		<SkeletonLoader height={size ?? 40} width={size ?? 40} variant="circular" />
	) : link ? (
		<Link href={`/${userTagName}`} passHref>
			<StyledLink>
				<StyledAvatar
					src={src}
					alt={userTagName}
					aria-label={userTagName}
					size={size}
					onClick={onClick && onClick}
				>
					{!src && userTagName[0]}
				</StyledAvatar>
			</StyledLink>
		</Link>
	) : (
		<StyledAvatar
			src={src}
			alt={userTagName}
			aria-label={userTagName}
			size={size}
			onClick={onClick && onClick}
		>
			{!src && userTagName[0]}
		</StyledAvatar>
	);
};

export default AvatarProfile;

const StyledLink = styled.a`
	position: relative;
	display: flex;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	outline: none;

	&::after {
		content: "";
		position: absolute;
		inset: 0px;
		background: rgba(0, 0, 0, 0.15);
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	&:hover,
	&:focus-visible {
		&::after {
			opacity: 1;
		}
	}

	&:focus-visible {
		background-color: rgb(142, 205, 248);
		box-shadow: rgb(199, 230, 252) 0px 0px 0px 2px;
	}
`;

const StyledAvatar = styled(Avatar)`
	background-color: rgb(45, 49, 51);
	width: ${({ size }) => (size ? `${size}px` : "40px")};
	height: ${({ size }) => (size ? `${size}px` : "40px")};
	font-size: 20px;
	cursor: pointer;
`;
