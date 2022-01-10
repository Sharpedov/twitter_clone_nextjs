import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import {
	Controller,
	FormProvider,
	SubmitHandler,
	useForm,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Modal from "src/components/modal";
import Input from "src/components/input";
import CustomButton from "src/components/button";
import CreateAccountFormStepTwo from "./createAccountFormStepTwo";
import { useDispatch, useSelector } from "react-redux";
import { checkEmailIsExists } from "src/store/slices/authSlice";
import CreateAccountFormStepThree from "./createAccountFormStepThree";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TopBar from "src/components/topBar";

interface Props {
	createAccountModal: boolean;
	setCreateAccountModal: (prev) => void;
}

interface FormInputs {
	name: string;
	email: string;
	password: string;
	repeatPassword: string;
	tagName: string;
}

const yupSchema = yup.object().shape({
	name: yup
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(50, "Name must be at least 50 characters")
		.required("Name is required"),
	email: yup
		.string()
		.email("Must be a valid email")
		.max(80, "Email must be at least 80 characters")
		.required("Email is required"),
});

const mapState = (state) => ({
	checkEmailLoading: state.auth.checkEmail.loading,
	checkEmailError: state.auth.checkEmail.error,
	checkTagNameLoading: state.auth.checkTagName.loading,
	createAccountLoading: state.auth.createAccount.loading,
});

const CreateAccountForm: React.FC<Props> = ({
	createAccountModal,
	setCreateAccountModal,
}) => {
	const [step, setStep] = useState<number>(1);
	const {
		checkEmailLoading,
		checkEmailError,
		checkTagNameLoading,
		createAccountLoading,
	} = useSelector(mapState);
	const methods = useForm<FormInputs>({
		resolver: yupResolver(yupSchema),
	});
	const {
		handleSubmit,
		control,
		watch,
		reset,
		formState: { errors },
	} = methods;
	const [credentialsData, setCredentialsData] = useState<FormInputs>({
		name: "",
		email: "",
		password: "",
		repeatPassword: "",
		tagName: "",
	});
	const watchAllFields = watch();
	const dispatch = useDispatch();

	const handleDisableSubmitButton = useMemo(
		() => !!watchAllFields.name?.trim() && !!watchAllFields.email?.trim(),
		[watchAllFields]
	);

	const handleClearCredentialsData = useCallback(() => {
		setCreateAccountModal(false);
		setCredentialsData({
			name: "",
			email: "",
			password: "",
			repeatPassword: "",
			tagName: "",
		});
		reset();
		setStep(1);
	}, [reset, setCreateAccountModal]);

	const handleNextStep = useCallback(
		(data: FormInputs) => {
			setCredentialsData({ ...credentialsData, ...data });

			return setStep((prev) => (prev === 3 ? 3 : prev + 1));
		},
		[credentialsData]
	);

	const handlePrevStep = useCallback(
		() => setStep((prev) => (prev === 1 ? 1 : prev - 1)),
		[]
	);

	const handleOnSubmit: SubmitHandler<FormInputs> = (data: FormInputs) => {
		const { name, email } = data;
		dispatch(
			checkEmailIsExists({
				email: email.trim().toLowerCase(),
				onComplete: () =>
					handleNextStep({
						name: name.trim(),
						email: email.trim().toLowerCase(),
						...data,
					}),
			})
		);

		return;
	};

	return (
		<Modal
			Icon={step !== 1 && ArrowBackRoundedIcon}
			isOpen={createAccountModal}
			onClose={() =>
				step === 1 ? handleClearCredentialsData() : handlePrevStep()
			}
		>
			<TopBar
				loading={
					checkEmailLoading || checkTagNameLoading || createAccountLoading
				}
				Icon={step !== 1 ? ArrowBackRoundedIcon : CloseRoundedIcon}
				iconAriaLabel={step !== 1 && "Go back"}
				onClose={() =>
					step !== 1 ? handlePrevStep() : handleClearCredentialsData()
				}
				text={`Step ${step} of 3`}
			/>
			<FormProvider {...methods}>
				<Heading>
					<span>Create account</span>
				</Heading>
				{step === 1 ? (
					<Form onSubmit={handleSubmit(handleOnSubmit)}>
						<Controller
							control={control}
							name="name"
							defaultValue=""
							render={({ field }) => (
								<Input
									field={field}
									label="Name"
									error={errors.name && errors.name.message}
								/>
							)}
						/>
						<Controller
							control={control}
							name="email"
							defaultValue=""
							render={({ field }) => (
								<Input
									field={field}
									label="Email"
									error={
										(errors.email && errors.email.message) || checkEmailError
									}
								/>
							)}
						/>

						<BottomRow>
							<CustomButton
								type="submit"
								size="large"
								fullWidth
								disabled={!handleDisableSubmitButton || checkEmailLoading}
								color="secondary"
							>
								Next
							</CustomButton>
						</BottomRow>
					</Form>
				) : step === 2 ? (
					<CreateAccountFormStepTwo
						nextStep={handleNextStep}
						credentialsData={credentialsData}
					/>
				) : step === 3 ? (
					<CreateAccountFormStepThree
						credentialsData={credentialsData}
						resetCredentialsData={() => handleClearCredentialsData()}
						closeModal={() => setCreateAccountModal((prev) => !prev)}
					/>
				) : null}
			</FormProvider>
		</Modal>
	);
};

export default CreateAccountForm;

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
	margin: 16px 32px;
`;

const BottomRow = styled.div`
	display: flex;
	padding: 12px 0 36px;
	margin-top: auto;
`;
