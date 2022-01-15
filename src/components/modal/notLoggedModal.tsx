import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeNotLoggedModal } from "src/store/slices/modalSlice";
import styled from "styled-components";
import Modal from ".";
import TwitterIcon from "@mui/icons-material/Twitter";
import TopBar from "../topBar";
import CustomButton from "../button";
import CreateAccountForm from "../form/createAccountForm";
import LoginForm from "../form/loginForm";

interface Props {}

const mapState = (state) => ({
	isOpen: state.modal.notLogged.isOpen,
});

const NotLoggedModal: React.FC<Props> = () => {
	const { isOpen } = useSelector(mapState);
	const [loginModal, setLoginModal] = useState<boolean>(false);
	const [createAccountModal, setCreateAccountModal] = useState<boolean>(false);
	const dispatch = useDispatch();

	const handleCloseModal = useCallback(
		() => dispatch(closeNotLoggedModal()),
		[dispatch]
	);

	const handleOpenLoginModal = useCallback(() => {
		handleCloseModal();
		setLoginModal(true);
	}, [handleCloseModal]);

	const handleOpenCreateAccountModal = useCallback(() => {
		handleCloseModal();
		setCreateAccountModal(true);
	}, [handleCloseModal]);

	return (
		<>
			<CreateAccountForm
				createAccountModal={createAccountModal}
				setCreateAccountModal={setCreateAccountModal}
			/>
			<LoginForm
				loginModal={loginModal}
				setLoginModal={setLoginModal}
				setCreateAccountModal={setCreateAccountModal}
			/>
			<Modal isOpen={isOpen} onClose={handleCloseModal} shouldCloseOutside>
				<TopBar onClose={handleCloseModal} />
				<Inner>
					<Logo>
						<TwitterIcon className="notLoggedModal__logoIcon" />
					</Logo>
					<Content>
						<Row1>
							<span>Stay up to date</span>
							<span>See what&apos;s happening in the world right now</span>
						</Row1>
						<Row2>
							<CustomButton size="large" onClick={handleOpenLoginModal}>
								Login
							</CustomButton>
							<CustomButton
								size="large"
								variant="outlined"
								onClick={handleOpenCreateAccountModal}
							>
								Create Account
							</CustomButton>
						</Row2>
					</Content>
				</Inner>
			</Modal>
		</>
	);
};

export default NotLoggedModal;

const Inner = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	margin-top: -53px;
	align-items: center;
	justify-content: center;
`;

const Logo = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 16px 0;

	& .notLoggedModal__logoIcon {
		font-size: 46px;
	}
`;

const Content = styled.div`
	max-width: 400px;
	margin: 32px;
`;

const Row1 = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 32px;
	& > span {
		text-align: left;
		overflow-wrap: break-word;
		&:nth-child(1) {
			margin-bottom: 8px;
			line-height: 32px;
			font-size: 26px;
			font-weight: 700;
		}
		&:nth-child(2) {
			font-weight: 400;
			font-size: 15px;
			line-height: 20px;
			color: ${({ theme }) => theme.colors.text.secondary};
		}
	}
`;

const Row2 = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px 0;
`;
