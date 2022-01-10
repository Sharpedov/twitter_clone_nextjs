import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { removeNotification } from "src/store/slices/notificationsSlice";
import styled from "styled-components";

interface Props {
	id: string;
	message: string;
	time: number;
}

const Notification: React.FC<Props> = ({ id, message, time }) => {
	const timeoutIdRef = useRef(null);
	const dispatch = useDispatch();

	useMemo(() => {
		const timeout = setTimeout(() => {
			dispatch(removeNotification({ id }));
		}, time);

		timeoutIdRef.current = timeout;
	}, [dispatch, time, id]);

	useEffect(() => {
		return () => clearTimeout(timeoutIdRef.current);
	}, []);

	return (
		<Container
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
		>
			<span>{message}</span>
		</Container>
	);
};

export default Notification;

const Container = styled(motion.div)`
	display: flex;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.color.primary};
	margin-top: 12px;
	min-width: 220px;
	max-width: 3020px;
	padding: 12px;
	border-radius: 4px;
	color: #fff;
	font-size: 15px;
	font-weight: 400;
	pointer-events: all;
	box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.2);

	& > span {
		padding: 0 10px;
	}
`;
