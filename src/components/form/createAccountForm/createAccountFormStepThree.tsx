import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import CustomButton from "src/components/button";
import Input from "src/components/input";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
	checkTagNameIsExists,
	createAccount,
} from "src/store/slices/authSlice";
import { useRouter } from "next/router";

interface FormInputs {
	tagName: string;
}

const yupSchema = yup.object().shape({
	tagName: yup
		.string()
		.min(4, "Tag name must be at least 4 characters")
		.max(25, "Tag name must be at least 16 characters")
		.required("Tag name is required"),
});

interface Props {
	credentialsData: any;
	closeModal: () => void;
	resetCredentialsData: () => void;
}

const mapState = (state) => ({
	checkTagNameLoading: state.auth.checkTagName.loading,
	checkTagNameError: state.auth.checkTagName.error,
	createAccountLoading: state.auth.createAccount.loading,
});

const CreateAccountFormStepThree: React.FC<Props> = ({
	credentialsData,
	closeModal,
	resetCredentialsData,
}) => {
	const methods = useForm<FormInputs>({
		resolver: yupResolver(yupSchema),
	});
	const { checkTagNameLoading, checkTagNameError, createAccountLoading } =
		useSelector(mapState);
	const {
		handleSubmit,
		control,
		watch,
		setFocus,
		formState: { errors },
	} = methods;
	const watchAllFields = watch();
	const dispatch = useDispatch();
	const { replace } = useRouter();

	const handleOnSubmit: SubmitHandler<FormInputs> = (data: FormInputs) => {
		const { tagName } = data;
		dispatch(
			checkTagNameIsExists({
				tagName,
				onComplete: () =>
					dispatch(
						createAccount({
							...credentialsData,
							tagName,
							onComplete: () => {
								resetCredentialsData();
								closeModal();
								replace("/home");
							},
						})
					),
			})
		);
		return;
	};

	useEffect(() => {
		setFocus("tagName");
	}, [setFocus]);

	return (
		<Form onSubmit={handleSubmit(handleOnSubmit)} autoComplete="off">
			<Controller
				control={control}
				name="tagName"
				defaultValue=""
				render={({ field }) => (
					<Input
						field={field}
						label="Tag name"
						error={
							(errors.tagName && errors.tagName.message) || checkTagNameError
						}
					/>
				)}
			/>
			<BottomRow>
				<CustomButton
					type="submit"
					size="large"
					fullWidth
					color="secondary"
					disabled={Boolean(
						!watchAllFields.tagName?.trim() ||
							checkTagNameLoading ||
							createAccountLoading
					)}
				>
					Create account
				</CustomButton>
			</BottomRow>
		</Form>
	);
};

export default CreateAccountFormStepThree;

const Form = styled.form`
	position: relative;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	margin: 0 32px;
`;

const BottomRow = styled.div`
	display: flex;
	padding: 12px 0 36px;
	margin-top: auto;
`;
