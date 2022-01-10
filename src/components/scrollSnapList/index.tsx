import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { ButtonBase } from "@mui/material";
import { useRef } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import IconButton from "../iconButton";

type ItemType = {
	text: string;
	href: string;
	active: boolean;
};

interface Props {
	list: ItemType[];
}

const ScrollSnapList: React.FC<Props> = ({ list }) => {
	const listRef = useRef<HTMLDivElement>(null!);
	const firstItemRef = useRef<HTMLDivElement>(null!);
	const lastItemRef = useRef<HTMLDivElement>(null!);
	const [firstItemIsOffTheScreen, setFirstItemIsOffTheScreen] =
		useState<boolean>(false);
	const [secondItemIsOffTheScreen, setSecondItemIsOffTheScreen] =
		useState<boolean>(false);

	useEffect(() => {
		const { current } = listRef;

		if (current && firstItemRef.current && lastItemRef.current) {
			const checkIfFirstAndLastItemIsOffTheScreen = () => {
				if (current.getBoundingClientRect().width <= 460) {
					setFirstItemIsOffTheScreen(
						firstItemRef.current.getBoundingClientRect().left - 15 <
							-firstItemRef.current.getBoundingClientRect().width / 2
					);

					setSecondItemIsOffTheScreen(
						!(
							listRef.current.getBoundingClientRect().width -
								lastItemRef.current.getBoundingClientRect().width / 2 >=
								lastItemRef.current.getBoundingClientRect().left && true
						)
					);
				}
			};

			current.addEventListener("scroll", checkIfFirstAndLastItemIsOffTheScreen);
			window.addEventListener("resize", checkIfFirstAndLastItemIsOffTheScreen);

			checkIfFirstAndLastItemIsOffTheScreen();
			return () => {
				current.removeEventListener(
					"scroll",
					checkIfFirstAndLastItemIsOffTheScreen
				);
				window.removeEventListener(
					"resize",
					checkIfFirstAndLastItemIsOffTheScreen
				);
			};
		}
	}, []);

	return (
		<List>
			<ArrowWrapper side="left" active={firstItemIsOffTheScreen}>
				<IconButton Icon={ArrowBackRoundedIcon} ariaLabel="Prev" />
			</ArrowWrapper>
			<ListInner ref={listRef}>
				{list.map((item, i) => (
					<Item
						key={item.text}
						ref={
							i === 0
								? firstItemRef
								: i === list.length - 1
								? lastItemRef
								: null
						}
					>
						<Link href={item.href} passHref scroll={false} replace>
							<Item component="div" active={item.active}>
								<a href={item.href} tabIndex={-1}>
									<span>
										{item.text} <span />
									</span>
								</a>
							</Item>
						</Link>
					</Item>
				))}
			</ListInner>
			<ArrowWrapper side="right" active={secondItemIsOffTheScreen}>
				<IconButton Icon={ArrowForwardRoundedIcon} ariaLabel="Prev" />
			</ArrowWrapper>
		</List>
	);
};

export default ScrollSnapList;

const List = styled.nav`
	position: relative;
	display: flex;
	width: 100%;
	border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const ListInner = styled.div`
	display: flex;
	width: 100%;
	flex-grow: 1;
	scroll-padding: 0px 36px;
	scrollbar-width: none;
	scroll-snap-type: x mandatory;
	overflow-y: hidden;
	overflow-x: auto;
	transform: translate3d(0px, 0px, 0px);
	height: 100%;

	&::-webkit-scrollbar {
		display: none;
	}
`;

const Item = styled(ButtonBase)`
	display: flex;
	flex-grow: 1;
	text-transform: none;
	font-size: 15px;
	font-weight: 400;
	overflow-wrap: break-word;
	white-space: nowrap;
	height: 53px;
	line-height: 20px;
	font-family: ${({ theme }) => theme.fonts.title};
	border-radius: 0px;
	color: ${({ theme, active }) =>
		active ? theme.colors.text.primary : theme.colors.text.secondary};
	transition: background-color 0.15s ease;

	& > a {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0px 16px;
		flex-grow: 1;

		& > span {
			position: relative;
			padding: 16px 0;

			& > span {
				position: absolute;
				display: inline-block;
				opacity: ${({ active }) => (active ? "1" : "0")};
				height: 4px;
				left: 0px;
				right: 0px;
				bottom: 0px;
				background-color: ${({ theme }) => theme.colors.color.primary};
				border-radius: 9999px;
				width: 100%;
				transition: opacity 0.1s ease;
			}
		}
	}

	&:hover {
		background-color: ${({ theme }) => theme.colors.hover.primary};
	}

	&:focus-visible {
		background-color: ${({ theme }) => theme.colors.hover.primary};
	}
`;

const ArrowWrapper = styled.div`
	position: absolute;
	top: 50%;
	opacity: ${({ active }) => (active ? "1" : "0")};
	pointer-events: ${({ active }) => (active ? "all" : "none")};
	left: ${({ side }) => side === "left" && " 10px"};
	right: ${({ side }) => side === "right" && " 10px"};
	transform: translateY(-50%);
	z-index: 3;
	background-color: rgba(15, 20, 25, 0.75);
	border-radius: 50%;
	min-width: 36px;
	min-height: 36px;
	transition: opacity 0.2s ease;
`;
