import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { ButtonBase } from "@mui/material";

interface Props {
	href: string;
	Icon: any;
	title: string;
	ariaLabel: string;
	isActive?: boolean;
}

const HeaderNavLink: React.FC<Props> = ({
	href,
	Icon,
	title,
	ariaLabel,
	isActive,
}) => {
	return href ? (
		<Link href={href} passHref>
			<StyledLink href={href}>
				<NavLink isActive={isActive} component="div" tabIndex={-1}>
					<Icon className="header__navItemIcon" />
					<span className="header_navItemSpan">{title}</span>
				</NavLink>
			</StyledLink>
		</Link>
	) : (
		<div style={{ padding: "4px 0" }} aria-label={ariaLabel}>
			<NavLink>
				<Icon className="header__navItemIcon" />
				<span className="header_navItemSpan">{title}</span>
			</NavLink>
		</div>
	);
};

export default HeaderNavLink;

const StyledLink = styled.a`
	display: flex;
	padding: 4px 0;
	outline: none;

	@media screen and (min-width: 1290px) {
		width: 100%;
	}
`;

const NavLink = styled(ButtonBase)`
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: ${({ isActive }) => (isActive ? 700 : 400)};
	font-size: 20px;
	text-transform: none;
	color: ${({ theme }) => theme.colors.text.primary};
	padding: 8px;
	border-radius: 50px;
	user-select: none;
	transition: 0.1s ease;
	line-height: 20px;
	font-family: ${({ theme }) => theme.fonts.main};

	${StyledLink}:hover &,${StyledLink}:focus-visible & {
		background-color: ${({ theme }) => theme.colors.hover.primary};
	}

	&:hover {
		background-color: ${({ theme }) => theme.colors.hover.primary};
	}

	& > .header__navItemIcon {
		font-size: 26px;
		stroke: #fff;
	}

	& > .header_navItemSpan {
		display: none;
	}

	@media ${({ theme }) => theme.breakpoints.md} {
		padding: 12px;
	}
	@media screen and (min-width: 1290px) {
		& > .header_navItemSpan {
			display: inline-block;
			font-size: inherit;
			margin: 0 16px 0 20px;
		}
	}
`;
