import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import styled from "styled-components";

interface Props {
	position?: "top" | "bottom";
	loading: boolean;
	height?: number;
}

const LinearLoader: React.FC<Props> = ({
	position,
	loading = false,
	height,
}) => {
	return (
		loading && (
			<StyledLinearProgress
				position={position ?? "bottom"}
				height={height ?? 3}
			/>
		)
	);
};

export default LinearLoader;

const StyledLinearProgress = styled(LinearProgress)`
	position: absolute;
	top: ${({ position }) => (position === "bottom" ? "none" : "0px")};
	bottom: ${({ position }) => (position === "bottom" ? "0px" : "none")};
	left: 0;
	right: 0;
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 0px 0px 1px 1px;
	height: ${({ height }) => (height ? `${height}px` : "3px")};

	& > div {
		background: ${({ theme }) => theme.colors.color.primary};
	}
`;
