import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import CustomButton from "src/components/button";
import Input from "src/components/input";
import styled from "styled-components";

interface FormInputs {
	password: string;
	repeatPassword: string;
}

const yupSchema = yup.object().shape({
	password: yup
		.string()
		.min(4, "Password must be at least 4 characters")
		.max(16, "Password must be at most 16 characters")
		.required("Password is required"),
	repeatPassword: yup
		.string()
		.required("Repeat Password is required")
		.oneOf([yup.ref("password"), null], "Password does not match"),
});

interface Props {
	nextStep: (data) => void;
	credentialsData: any;
}

const CreateAccountFormStepTwo: React.FC<Props> = ({
	nextStep,
	credentialsData,
}) => {
	const methods = useForm<FormInputs>({
		resolver: yupResolver(yupSchema),
	});
	const {
		handleSubmit,
		control,
		watch,
		setFocus,
		formState: { errors },
	} = methods;
	const watchAllFields = watch();

	const handleOnSubmit: SubmitHandler<FormInputs> = (data: FormInputs) => {
		const { password, repeatPassword } = data;
		nextStep({
			password: password,
			repeatPassword: repeatPassword,
			...data,
		});
		return;
	};

	useEffect(() => {
		setFocus("password");
	}, [setFocus]);

	return (
		<Form onSubmit={handleSubmit(handleOnSubmit)}>
			<Controller
				control={control}
				name="password"
				defaultValue={credentialsData.password}
				render={({ field }) => (
					<Input
						type="password"
						field={field}
						label="Password"
						error={errors.password && errors.password.message}
					/>
				)}
			/>
			<Controller
				control={control}
				name="repeatPassword"
				defaultValue={credentialsData.repeatPassword}
				render={({ field }) => (
					<Input
						type="password"
						field={field}
						label="Repeat password"
						error={errors.repeatPassword && errors.repeatPassword.message}
					/>
				)}
			/>

			<BottomRow>
				<CustomButton
					type="submit"
					size="large"
					fullWidth
					disabled={
						!Boolean(
							(watchAllFields.password?.trim() &&
								watchAllFields.repeatPassword?.trim()) ||
								(credentialsData.password && credentialsData.repeatPassword)
						)
					}
					color="secondary"
				>
					Next
				</CustomButton>
			</BottomRow>
		</Form>
	);
};

export default CreateAccountFormStepTwo;

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
