import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

interface Props {
	placeholder: string;
	maxLength?: number;
	value: string;
	setValue: (string: string) => void;
	textareaMinHeight?: number;
}
const Textarea: React.FC<Props> = ({
	placeholder,
	maxLength,
	value,
	setValue,
	textareaMinHeight,
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleTextareaChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setValue(e.target.value);
		},
		[setValue]
	);

	useEffect(() => {
		if (textareaRef && textareaRef.current) {
			textareaRef.current.style.height = "0px";
			const scrollHeight = textareaRef.current.scrollHeight;
			textareaRef.current.style.height = scrollHeight + "px";
		}
	}, [value]);

	return (
		<StyledLabel layout>
			<StyledTextarea
				style={{
					minHeight: `${textareaMinHeight ? `${textareaMinHeight}px` : "auto"}`,
				}}
				layout
				ref={textareaRef}
				value={value}
				onChange={handleTextareaChange}
				placeholder={placeholder}
				maxLength={maxLength ?? 250}
			/>
		</StyledLabel>
	);
};

export default Textarea;

const StyledLabel = styled(motion.label)`
	display: flex;
	width: 100%;
	padding: 12px 0;
	overflow: hidden;
`;

const StyledTextarea = styled(motion.textarea)`
	width: 100%;
	direction: ltr;
	text-align: left;
	white-space: pre-wrap;
	user-select: text;
	overflow-wrap: break-word;
	font-size: 18px;
	font-weight: 400;
	padding: 2px 0;
	resize: none;
	background: ${({ theme }) => theme.colors.background.primary};
	color: ${({ theme }) => theme.colors.text.primary};

	&::-webkit-scrollbar {
		display: none;
	}

	&::placeholder {
		color: ${({ theme }) => theme.colors.text.secondary};
	}
`;
