import { useRouter } from "next/router";
import React from "react";
import ProfileFollowsTemplate from "src/templates/profileFollowsTemplate";
import ProfileTemplate from "src/templates/profileTemplate";
import styled from "styled-components";
import Header from "./header";
import NotLoggedModal from "./modal/notLoggedModal";

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
	const { asPath, pathname } = useRouter();

	return (
		<>
			{asPath !== "/" ? (
				<Container>
					<Header />
					<Main>
						{pathname.includes("/[tagName]") ? (
							pathname === "/[tagName]/followers" ||
							pathname === "/[tagName]/following" ? (
								<ProfileFollowsTemplate>{children}</ProfileFollowsTemplate>
							) : (
								<ProfileTemplate>{children}</ProfileTemplate>
							)
						) : (
							children
						)}
					</Main>
					<NotLoggedModal />
				</Container>
			) : (
				children
			)}
		</>
	);
};

export default Layout;

const Container = styled.div`
	display: flex;
	width: 100%;
	min-height: 100vh;
	margin: 0 auto;
	flex: 1;

	@media ${({ theme }) => theme.breakpoints.md} {
		max-width: 688px;
	}
	@media ${({ theme }) => theme.breakpoints.lg} {
		max-width: 1008px;
	}
	@media screen and (min-width: 1110px) {
		max-width: 1078px;
	}
	@media screen and (min-width: 1290px) {
		max-width: 1260px;
	}
`;

const Main = styled.main`
	display: flex;
	flex-grow: 1;
	gap: 0 30px;
	width: 100%;
`;
