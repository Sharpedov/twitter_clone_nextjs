import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Notification from "./notification";

interface Props {}

const mapState = (state) => ({
	notifications: state.notifications.notifications,
});

const Notifications: React.FC<Props> = ({ children }) => {
	const { notifications } = useSelector(mapState);

	return (
		<>
			<>
				<Container>
					<AnimatePresence initial={false}>
						{notifications.map((notifi) => (
							<Notification
								key={`${notifi.id}-notification`}
								id={notifi.id}
								message={notifi.message}
								time={notifi.time}
							/>
						))}
					</AnimatePresence>
				</Container>
			</>
			{children}
		</>
	);
};

export default Notifications;

const Container = styled.div`
	position: fixed;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	left: 50%;
	bottom: 32px;
	transform: translateX(-50%);
	z-index: 910;
	pointer-events: none;
`;
