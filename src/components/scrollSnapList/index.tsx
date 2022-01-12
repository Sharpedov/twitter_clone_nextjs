import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { ButtonBase } from "@mui/material";
import { useRef } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import IconButton from "../iconButton";
import Link from "next/link";

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

	const handleForward = useCallback(() => {
		if (listRef.current) {
			const { width } = listRef.current.getBoundingClientRect();

			listRef.current.scrollLeft += 460 - width;
		}
	}, []);
	const handleBackwards = useCallback(() => {
		if (listRef.current) {
			const { width } = listRef.current.getBoundingClientRect();

			listRef.current.scrollLeft += width - 460;
		}
	}, []);

	return (
		<List>
			<ArrowWrapper side="left" active={firstItemIsOffTheScreen}>
				<IconButton
					Icon={ArrowBackRoundedIcon}
					ariaLabel="Backwards"
					onClick={handleBackwards}
					disableFocus
				/>
			</ArrowWrapper>
			<ListInner ref={listRef}>
				{list.map((item, i) => (
					<Link key={item.text} href={item.href} passHref>
						<StyledLink>
							<Item
								tabIndex={-1}
								component="div"
								active={item.active}
								ref={
									i === 0
										? firstItemRef
										: i === list.length - 1
										? lastItemRef
										: null
								}
							>
								<div>
									<span>
										{item.text} <span />
									</span>
								</div>
							</Item>
						</StyledLink>
					</Link>
				))}
			</ListInner>
			<ArrowWrapper side="right" active={secondItemIsOffTheScreen}>
				<IconButton
					Icon={ArrowForwardRoundedIcon}
					ariaLabel="Forward"
					onClick={handleForward}
					disableFocus
				/>
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
	user-select: none;
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

const StyledLink = styled.a`
	width: 100%;
	outline: none;
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

	& > div {
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

	${StyledLink}:focus-visible & {
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
