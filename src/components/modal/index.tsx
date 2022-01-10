import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import FocusTrap from "focus-trap-react";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	shouldCloseOutside?: boolean;
	Icon?: any;
	toTop?: boolean;
}

const backdropVariants = {
	hidden: { opacity: 0, transition: { duration: 0.2 } },
	visible: { opacity: 1, transition: { duration: 0.2 } },
};

const contentVariants = {
	hidden: {
		scale: 0.93,
		opacity: 0,
		transition: { duration: 0.2 },
	},
	visible: {
		scale: 1,
		opacity: 1,
		transition: { duration: 0.2, delay: 0.03 },
	},
};

const Modal: React.FC<Props> = ({
	children,
	isOpen,
	onClose,
	shouldCloseOutside,
	toTop,
}) => {
	const [mounted, setMounted] = useState(false);
	const backdropRef = useRef<HTMLElement>(null!);

	const handleClose = useCallback(
		(e: Event) => e.target === backdropRef.current && onClose(),
		[onClose]
	);

	const handleEscape = useCallback(
		(e: KeyboardEvent) => e.key === "Escape" && onClose(),
		[onClose]
	);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (backdropRef.current) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [handleEscape]);

	return (
		mounted &&
		createPortal(
			<AnimatePresence exitBeforeEnter>
				{isOpen && (
					<Backdrop
						layout
						toTop={toTop}
						ref={backdropRef}
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						onClick={shouldCloseOutside && handleClose}
					>
						<Content layout toTop={toTop} variants={contentVariants}>
							<ContentInner layout>{children}</ContentInner>
						</Content>
					</Backdrop>
				)}
			</AnimatePresence>,
			document.getElementById("modal")
		)
	);
};

export default Modal;

const Backdrop = styled(motion.div)`
	position: fixed;
	inset: 0px;
	display: ${({ toTop }) => (toTop ? "flex" : "grid")};
	align-items: ${({ toTop }) => (toTop ? "flex-start" : "center")};
	justify-content: ${({ toTop }) => (toTop ? "center" : "none")};
	justify-items: ${({ toTop }) => (toTop ? "none" : "center")};
	background-color: rgba(91, 112, 131, 0.4);
	z-index: 900;
`;

const Content = styled(motion.div)`
	position: relative;
	display: flex;
	flex-direction: column;
	background-color: ${({ theme }) => theme.colors.background.primary};
	overflow-y: scroll;
	height: 100vh;
	width: 100%;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}

	/* &::-webkit-scrollbar {
		width: 14px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.background.secondary};
		border: 3px solid ${({ theme }) => theme.colors.background.primary};
		border-radius: 0px 16px 16px 0px;

		&:hover {
			background-color: ${({ theme }) => theme.colors.color.primary};
		}
	} */

	@media ${({ theme }) => theme.breakpoints.md} {
		top: ${({ toTop }) => (toTop ? "5%" : "none")};
		min-width: 600px;
		max-width: 80vw;
		min-height: ${({ toTop }) => (toTop ? "auto" : "400px")};
		max-height: 90vh;
		height: ${({ toTop }) => (toTop ? "auto" : "650px")};
		border-radius: 16px;
		width: auto;
	}
`;

const ContentInner = styled(motion.div)`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	max-width: 600px;
	width: 100%;
	margin: 0 auto;
`;
