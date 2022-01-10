import React from "react";
import styled from "styled-components";

interface Props {
	height?: number;
	width?: number;
	variant?: "circular" | "rect";
	absolute?: boolean;
	radiusNone?: boolean;
}

const SkeletonLoader = ({
	height,
	width,
	variant,
	absolute,
	radiusNone,
}: Props) => {
	return (
		<Container
			height={height}
			width={width}
			variant={variant ?? "rect"}
			absolute={absolute}
			radiusNone={radiusNone}
		>
			<Swipe />
		</Container>
	);
};

export default SkeletonLoader;

const Container = styled.div`
	position: ${({ absolute }) => (absolute ? "absolute" : "relative")};
	inset: ${({ absolute }) => (absolute ? "0px" : "none")};

	height: ${({ height }) => (height ? `${height}px` : "100%")};
	width: ${({ width }) => (width ? `${width}px` : "100%")};
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: ${({ variant, radiusNone }) =>
		radiusNone ? "0px" : variant === "circular" ? "50%" : "16px"};
	overflow: hidden;
`;

const Swipe = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(
		90deg,
		transparent,
		rgba(255, 255, 255, 0.08),
		transparent
	);
	background-repeat: no-repeat;
	height: 100%;
	animation: loaderSwipeAnim 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;

	@keyframes loaderSwipeAnim {
		0% {
			left: -100%;
		}
		100% {
			left: 100%;
		}
	}
`;
