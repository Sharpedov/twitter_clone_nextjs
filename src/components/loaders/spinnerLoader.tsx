import React from "react";
import styled from "styled-components";

interface Props {
	loading: boolean;
	center?: boolean;
	paddingTop?: number;
	paddingBottom?: number;
	color?: "primary" | "secondary";
}

const SpinnerLoader: React.FC<Props> = ({
	loading = false,
	center,
	paddingTop,
	paddingBottom,
	color,
}) => {
	return (
		loading && (
			<div
				style={{
					display: "flex",
					justifyContent: center && "center",
					paddingTop: paddingTop ?? "25px",
					paddingBottom: paddingBottom ?? "25px",
				}}
			>
				<Spinner color={color ?? "primary"} />
			</div>
		)
	);
};

export default SpinnerLoader;

const Spinner = styled.div`
	display: flex;
	font-size: 2.5px;
	position: relative;
	text-indent: -9999em;
	border-top: ${({ color, theme }) =>
		color === "primary"
			? `1.5em solid ${theme.colors.active.secondary}`
			: `1.5em solid ${theme.colors.text.primary}`};
	border-right: ${({ color, theme }) =>
		color === "primary"
			? `1.5em solid ${theme.colors.active.secondary}`
			: `1.5em solid ${theme.colors.text.primary}`};
	border-bottom: ${({ color, theme }) =>
		color === "primary"
			? `1.5em solid ${theme.colors.active.secondary}`
			: `1.5em solid ${theme.colors.text.primary}`};
	border-left: ${({ color, theme }) =>
		color === "primary"
			? `1.5em solid ${theme.colors.color.primary}}`
			: `1.5em solid ${theme.colors.text.secondary}`};
	transform: translateZ(0);
	animation: load8 0.7s infinite linear;
	border-radius: 50%;
	width: 10em;
	height: 10em;

	&::after {
		border-radius: 50%;
		width: 10em;
		height: 10em;
	}

	@keyframes load8 {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;
