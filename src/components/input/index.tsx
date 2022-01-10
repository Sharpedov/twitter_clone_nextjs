import React, { useState } from "react";
import styled from "styled-components";
import IconButton from "../iconButton";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

interface Props {
	field: {
		name;
		onChange;
		onBlur;
		ref;
		value;
	};
	type?: string;
	label: string;
	error: string;
}

const Input: React.FC<Props> = ({
	field: { name, onChange, onBlur, ref, value },
	type,
	label,
	error,
}) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	return (
		<Container>
			<StyledInput
				ref={ref}
				type={showPassword ? "text" : type}
				onBlur={onBlur}
				name={name}
				value={value}
				onChange={onChange}
				error={error}
			/>
			<StyledLabel isFilled={value} error={error}>
				<span>{label}</span>
			</StyledLabel>
			{error && (
				<ErrorMessage>
					<span>{error}</span>
				</ErrorMessage>
			)}
			{type === "password" && (
				<ShowPasswordBtn>
					<IconButton
						disableFocus
						onClick={() => setShowPassword((prev) => !prev)}
						ariaLabel="Show password"
						Icon={
							showPassword ? VisibilityOffRoundedIcon : VisibilityRoundedIcon
						}
						size="small"
					/>
				</ShowPasswordBtn>
			)}
		</Container>
	);
};

export default Input;

const Container = styled.div`
	position: relative;
	background: transparent;
	border-radius: 4px;
	margin: 12px 0;
`;

const StyledLabel = styled.label`
	position: absolute;
	inset: 0;
	font-size: 15px;
	font-weight: 400;
	padding-left: 8px;
	pointer-events: none;
	color: ${({ theme, error }) =>
		error ? "rgb(244, 33, 46)" : theme.colors.text.secondary};
	border: 1px solid
		${({ theme, error }) =>
			error ? "rgb(244, 33, 46)" : theme.colors.border.primary};
	border-radius: 4px;
	overflow: hidden;
	transition: box-shadow 0.15s cubic-bezier(0.33, 1, 0.68, 1),
		color 0.15s cubic-bezier(0.33, 1, 0.68, 1),
		border-color 0.15s cubic-bezier(0.33, 1, 0.68, 1);

	> span {
		position: absolute;
		top: 50%;
		transform-origin: left;
		transform: ${({ isFilled }) =>
			isFilled ? "translateY(-110%) scale(0.85)" : "translateY(-50%) scale(1)"};
		transition: transform 0.15s cubic-bezier(0.33, 1, 0.68, 1);
	}
`;

const StyledInput = styled.input`
	background: transparent;
	padding: 26px 8px 8px;
	width: 100%;
	height: 100%;
	font-size: 15px;
	font-weight: 400;
	overflow-wrap: break-word;
	color: ${({ theme }) => theme.colors.text.primary};
	outline: none;

	&:focus-visible + ${StyledLabel} {
		box-shadow: ${({ theme, error }) =>
			error
				? "rgb(244, 33, 46) 0px 0px 0px 1px"
				: `${theme.colors.color.primary} 0px 0px 0px 1px`};
		color: ${({ theme, error }) =>
			error ? "rgb(244, 33, 46)" : theme.colors.color.primary};
		border-color: ${({ theme, error }) =>
			error ? "rgb(244, 33, 46)" : theme.colors.color.primary};

		& > span {
			transform: translateY(-110%) scale(0.85);
		}
	}
`;

const ErrorMessage = styled.div`
	position: absolute;
	display: flex;
	padding: 2px 8px 0;
	line-height: 16px;
	font-size: 13px;
	font-weight: 400;
	color: rgb(244, 33, 46);
`;

const ShowPasswordBtn = styled.div`
	position: absolute;
	top: 50%;
	right: 0;
	transform: translate(-10px, -50%);
`;
