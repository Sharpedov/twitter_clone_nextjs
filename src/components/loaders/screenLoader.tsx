import React from "react";
import styled from "styled-components";
import TwitterIcon from "@mui/icons-material/Twitter";

interface Props {}

const ScreenLoader: React.FC<Props> = () => {
	return (
		<Container>
			<TwitterIcon className="screenLoader__twitterIcon" />
		</Container>
	);
};

export default ScreenLoader;

const Container = styled.div`
	display: grid;
	place-items: center;
	background-color: ${({ theme }) => theme.colors.background.primary};
	height: 100vh;
	width: 100%;
	z-index: 800;

	& .screenLoader__twitterIcon {
		font-size: clamp(80px, 25vw, 100px);
		fill: ${({ theme }) => theme.colors.color.primary};
	}
`;
