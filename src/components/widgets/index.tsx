import React from "react";
import styled from "styled-components";

interface Props {}

const Widgets: React.FC<Props> = () => {
	return <Container>Widgets</Container>;
};

export default Widgets;

const Container = styled.div`
	display: none;

	@media ${({ theme }) => theme.breakpoints.lg} {
		position: sticky;
		top: 0px;
		display: flex;
		border-radius: 16px;
		flex-grow: 1;
		align-self: flex-start;
	}
`;
