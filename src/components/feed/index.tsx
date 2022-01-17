import React from "react";
import styled from "styled-components";

interface Props {
	children: React.ReactNode;
}
type RefType = HTMLDivElement;

const Feed = React.forwardRef(
	({ children }: Props, ref: React.ForwardedRef<RefType>) => {
		return <Container ref={ref}>{children}</Container>;
	}
);
export default Feed;
Feed.displayName = "Feed";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	border-right: 1px solid ${({ theme }) => theme.colors.border.primary};
	border-left: 1px solid ${({ theme }) => theme.colors.border.primary};

	min-height: 100vh;
	max-width: 600px;
	width: 100%;
	margin: 0 auto;

	@media ${({ theme }) => theme.breakpoints.md} {
		margin: 0;
	}
`;
