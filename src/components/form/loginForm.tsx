import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import {
	Controller,
	FormProvider,
	SubmitHandler,
	useForm,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../input";
import CustomButton from "../button";
import { useDispatch, useSelector } from "react-redux";
import { login } from "src/store/slices/authSlice";
import { useRouter } from "next/router";
import Modal from "../modal";
import TopBar from "../topBar";

interface Props {
	loginModal: boolean;
	setLoginModal: (prev) => void;
	setCreateAccountModal: (prev) => void;
}

interface FormInputs {
	email: string;
	password: string;
}

const yupSchema = yup.object().shape({
	email: yup
		.string()
		.email("Must be a valid email")
		.max(80, "Email must be at least 80 characters")
		.required("Email is required"),
	password: yup
		.string()
		.min(4, "Password must be at least 4 characters")
		.max(16, "Password must be at most 16 characters")
		.required("Password is required"),
});

const mapState = (state) => ({
	loginLoading: state.auth.login.loading,
});

const LoginForm: React.FC<Props> = ({
	loginModal,
	setLoginModal,
	setCreateAccountModal,
}) => {
	const methods = useForm<FormInputs>({ resolver: yupResolver(yupSchema) });
	const { loginLoading } = useSelector(mapState);
	const {
		handleSubmit,
		control,
		watch,
		reset,
		formState: { errors },
	} = methods;
	const watchAllFields = watch();
	const dispatch = useDispatch();
	const { replace } = useRouter();

	const handlerSignUp = useCallback(() => {
		setLoginModal(false);
		setCreateAccountModal(true);
	}, [setLoginModal, setCreateAccountModal]);

	const handleOnSubmit: SubmitHandler<FormInputs> = (data: FormInputs) => {
		const { email, password } = data;

		dispatch(
			login({
				email,
				password,
				onComplete: () => {
					reset();
					replace("/home");
				},
			})
		);
	};

	useEffect(() => {
		reset();
	}, [loginModal, reset]);

	return (
		<Modal isOpen={loginModal} onClose={() => setLoginModal(false)}>
			<TopBar loading={loginLoading} onClose={() => setLoginModal(false)} />

			<FormProvider {...methods}>
				<Form onSubmit={handleSubmit(handleOnSubmit)}>
					<Heading>
						<span>Log in</span>
					</Heading>
					<Controller
						control={control}
						name="email"
						defaultValue=""
						render={({ field }) => (
							<Input
								field={field}
								label="Email"
								error={errors.email && errors.email.message}
							/>
						)}
					/>
					<Controller
						control={control}
						name="password"
						defaultValue=""
						render={({ field }) => (
							<Input
								type="password"
								field={field}
								label="Password"
								error={errors.password && errors.password.message}
							/>
						)}
					/>

					<BottomRow>
						<CustomButton
							type="submit"
							size="large"
							fullWidth
							disabled={Boolean(
								loginLoading ||
									!(
										watchAllFields.email?.trim() &&
										watchAllFields.password?.trim()
									)
							)}
							color="secondary"
						>
							Log in
						</CustomButton>

						<span>
							You don&apos;t have an account yet?{" "}
							<span
								tabIndex={0}
								onClick={handlerSignUp}
								onKeyPress={(e) => e.key === "Enter" && handlerSignUp()}
							>
								Sign up
							</span>
						</span>
					</BottomRow>
				</Form>
			</FormProvider>
		</Modal>
	);
};

export default LoginForm;

const Form = styled.form`
	position: relative;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	margin: 0 32px;
`;

const Heading = styled.div`
	display: inline;
	line-height: 28px;
	font-size: 22px;
	font-weight: 700;
	overflow-wrap: break-word;
	color: ${({ theme }) => theme.colors.text.primary};
	margin: 16px 0;
`;

const BottomRow = styled.div`
	display: flex;
	flex-direction: column;
	padding: 12px 0 36px;
	margin-top: auto;

	& > span {
		margin-top: 40px;
		font-size: 15px;
		color: ${({ theme }) => theme.colors.text.secondary};

		& > span {
			color: ${({ theme }) => theme.colors.color.primary};
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}
		}
	}
`;
