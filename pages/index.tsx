import Head from "next/head";
import styled from "styled-components";
import TwitterIcon from "@mui/icons-material/Twitter";
import CustomButton from "src/components/button";
import { useEffect, useState } from "react";
import CreateAccountForm from "src/components/form/createAccountForm";
import LoginForm from "src/components/form/loginForm";
import { useUser } from "src/providers/userProvider";
import { useRouter } from "next/router";

export default function Default() {
	const { isLogged } = useUser();
	const { replace } = useRouter();
	const [createAccountModal, setCreateAccountModal] = useState<boolean>(false);
	const [loginModal, setLoginModal] = useState<boolean>(false);

	useEffect(() => {
		isLogged && replace("/home");
	}, [isLogged, replace]);

	return (
		<>
			<Head>
				<title>Default</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<Container>
				<CreateAccountForm
					createAccountModal={createAccountModal}
					setCreateAccountModal={setCreateAccountModal}
				/>

				<LoginForm
					loginModal={loginModal}
					setLoginModal={setLoginModal}
					setCreateAccountModal={setCreateAccountModal}
				/>
				<Col1>
					<img
						src="https://abs.twimg.com/sticky/illustrations/lohp_1302x955.png"
						alt="background"
						draggable="false"
					/>
				</Col1>
				<Col2>
					<Logo>
						<TwitterIcon className="defaultPage__logoIcon" />
					</Logo>
					<Title>
						<span>See what&apos;s happening in the world right now</span>
					</Title>
					<Subtitle>
						<span>Join Twitter today.</span>
					</Subtitle>
					<Row>
						<CustomButton
							onClick={() => setCreateAccountModal((prev) => !prev)}
						>
							Create your Twitter account
						</CustomButton>
					</Row>
					<BottomRow>
						<span>Already have an account?</span>
						<CustomButton onClick={() => setLoginModal((prev) => !prev)}>
							Log in
						</CustomButton>
					</BottomRow>
				</Col2>
			</Container>
		</>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: column-reverse;
	min-height: 100vh;
	flex: 1 1 auto;

	@media ${({ theme }) => theme.breakpoints.lg} {
		flex-direction: row;
	}
`;

const Col1 = styled.div`
	position: relative;
	display: flex;
	flex-grow: 1;
	background-color: rgb(0, 111, 214);
	min-height: 45vh;

	& > img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const Col2 = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	padding: 34px;

	@media ${({ theme }) => theme.breakpoints.lg} {
		max-width: 45vw;
	}
`;

const Logo = styled.div`
	padding-bottom: 11px;

	& .defaultPage__logoIcon {
		font-size: 45px;
	}
`;

const Title = styled.div`
	line-height: 49px;
	letter-spacing: -1px;
	font-size: 34px;
	font-weight: 700;
	overflow-wrap: break-word;
	margin: 38px 0;

	@media ${({ theme }) => theme.breakpoints.sm} {
		line-height: 62px;
		font-size: 48px;
		margin: 41px 0;
	}
	@media ${({ theme }) => theme.breakpoints.md} {
		line-height: 80px;
		font-size: 58px;
		margin: 46px 0;
	}
`;

const Subtitle = styled.div`
	line-height: 34px;
	letter-spacing: -0.5px;
	font-size: 20px;
	font-weight: 700;
	overflow-wrap: break-word;
	margin-bottom: 19px;

	@media ${({ theme }) => theme.breakpoints.sm} {
		font-size: 24px;
		margin-bottom: 25px;
	}
	@media ${({ theme }) => theme.breakpoints.md} {
		font-size: 27px;
		margin-bottom: 30px;
	}
`;

const Row = styled.div`
	display: flex;
	flex-direction: column;
`;

const BottomRow = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 40px;
	font-size: 17px;
	font-weight: 700;
	line-height: 20px;
	overflow-wrap: break-word;

	& > span {
		margin-bottom: 20px;
	}
`;