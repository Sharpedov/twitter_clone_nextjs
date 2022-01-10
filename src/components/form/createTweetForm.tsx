import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import AvatarProfile from "../profile/avatarProfile";
import Textarea from "../textarea";
import { BsImage } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { BiPoll } from "react-icons/bi";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import CloseIcon from "@mui/icons-material/Close";
import { addNotification } from "src/store/slices/notificationsSlice";
import { uploadFile } from "src/utils/uploadFile";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "src/providers/userProvider";
import CustomButton from "../button";
import IconButton from "../iconButton";
import TopBar from "src/components/topBar";
import { createTweet } from "src/store/slices/tweetSlice";
import { setImagePaddingBottom } from "src/utils/setImagePaddingBottom";

interface Props {
	setTweetUploadImgLoading?: (loading: boolean) => void;
	isInModal?: boolean;
	onCloseModal?: () => void;
}

const mapState = (state) => ({
	createTweetLoading: state.tweet.create.loading,
});

const CreateTweetForm: React.FC<Props> = ({
	setTweetUploadImgLoading,
	isInModal = false,
	onCloseModal,
}) => {
	const { user, loading, isLogged, mutate } = useUser();
	const { createTweetLoading } = useSelector(mapState);
	const [tweetValue, setTweetValue] = useState<string>("");
	const filepickerRef = useRef(null!);
	const [tweetImage, setTweetImage] = useState(null);
	const [tweetImagePaddingBottom, setTweetImagePaddingBottom] =
		useState<number>(0);
	const [showEmojisMenu, setShowEmojisMenu] = useState<boolean>(false);
	const [tweetUploadImg, setTweetUploadImg] = useState<boolean>(false);
	const dispatch = useDispatch();

	const handleAddTweetImage = useCallback(
		async (e) => {
			if (!!e.target.files[0]) {
				const file = e.target.files[0] as File;
				setTweetImagePaddingBottom(0);
				isInModal && setTweetUploadImg(true);
				setTweetUploadImgLoading && setTweetUploadImgLoading(true);
				setTweetImage(null);

				if (file.size >= 4 * 1024 * 1024) {
					isInModal && setTweetUploadImg(false);
					setTweetUploadImgLoading && setTweetUploadImgLoading(false);
					return dispatch(addNotification({ message: "File is too big" }));
				}

				const [data, err] = await uploadFile({ file });

				isInModal && setTweetUploadImg(false);
				setTweetUploadImgLoading && setTweetUploadImgLoading(false);
				if (err) return dispatch(addNotification({ message: err }));

				setImagePaddingBottom(setTweetImagePaddingBottom, data);
				setTweetImage(data);

				return;
			}
		},
		[dispatch, setTweetUploadImgLoading, isInModal]
	);

	const handleRemoveTweetImage = useCallback(() => {
		setTweetImage(null);
	}, []);

	const handleAddEmoji = useCallback((e) => {
		let sym = e.unified.split("-");
		let codesArray = [];
		sym.forEach((el) => codesArray.push("0x" + el));
		let emoji = String.fromCodePoint(...codesArray);
		setTweetValue((prev) => prev + emoji);
	}, []);

	const handleCreateTweet = useCallback(() => {
		dispatch(
			createTweet({
				text: tweetValue,
				userId: user._id,
				tweetImageUrl: tweetImage,
				paddingBottom: tweetImagePaddingBottom,
				onComplete: () => {
					isInModal && onCloseModal();
					setTweetValue("");
					setTweetImage(null);
					mutate();
				},
			})
		);
	}, [
		dispatch,
		tweetValue,
		user,
		tweetImage,
		onCloseModal,
		isInModal,
		tweetImagePaddingBottom,
		mutate,
	]);

	const disableCreateTweetButton = useMemo(
		() =>
			!tweetValue.trim() || !isLogged || createTweetLoading || tweetUploadImg,
		[tweetValue, isLogged, createTweetLoading, tweetUploadImg]
	);

	return (
		<>
			{isInModal && (
				<TopBar
					animatedLayout={isInModal}
					loading={tweetUploadImg || createTweetLoading}
					onClose={onCloseModal}
				>
					<div style={{ flexGrow: "1" }} />
					<TweetToolbarRightCol>
						{!!tweetValue.length && tweetValue.trim() && (
							<>
								<TweetLengthInfoCol>
									<span>{`${tweetValue.length} / 250`}</span>
								</TweetLengthInfoCol>
								<CircleTweetLengthProgressContainer>
									<CircleTweetLengthProgressBar
										progress={(tweetValue.length / 250) * 100}
									/>
								</CircleTweetLengthProgressContainer>
							</>
						)}
						<motion.div layout>
							<CustomButton
								disabled={disableCreateTweetButton}
								onClick={handleCreateTweet}
							>
								Tweet
							</CustomButton>
						</motion.div>
					</TweetToolbarRightCol>
				</TopBar>
			)}
			<TweetContainer layout>
				<TweetContainerInner layout>
					<TweetLeftColumn layout>
						<motion.div layout>
							<AvatarProfile
								src={user?.profile_image_url ?? ""}
								userTagName={user?.tag_name ?? "Loading"}
								size={48}
								loading={loading}
							/>
						</motion.div>
					</TweetLeftColumn>
					<TweetRightColumn layout>
						<Textarea
							textareaMinHeight={isInModal && 100}
							placeholder="What's going on?"
							maxLength={250}
							value={tweetValue}
							setValue={setTweetValue}
						/>
						<AnimatePresence>
							{!!tweetImage && !!tweetImagePaddingBottom && (
								<TweetImageContainer
									layout
									initial={{
										scale: 0.9,
										opacity: 0,
										transition: { duration: 0.25 },
									}}
									animate={{
										scale: 1,
										opacity: 1,
										transition: { duration: 0.25 },
									}}
									exit={{ opacity: 0, transition: { duration: 0.1 } }}
								>
									<TweetImageInner layout>
										<motion.div
											layout
											style={{ paddingBottom: `${tweetImagePaddingBottom}%` }}
										/>
										<Image
											src={tweetImage}
											alt="Image"
											layout="fill"
											objectFit="cover"
										/>
									</TweetImageInner>
									<RemoveImage onClick={handleRemoveTweetImage}>
										<IconButton
											Icon={CloseIcon}
											ariaLabel="Remove image"
											size="small"
										/>
									</RemoveImage>
								</TweetImageContainer>
							)}
						</AnimatePresence>
						<TweetToolbar layout>
							<TweetToolbarLeftCol layout>
								<IconButton
									onClick={() => filepickerRef.current.click()}
									Icon={BsImage}
									color="secondary"
									ariaLabel="Multimedia"
								>
									<input
										ref={filepickerRef}
										type="file"
										onChange={(e) => handleAddTweetImage(e)}
										hidden
										accept="image/png, image/jpeg"
									/>
								</IconButton>
								<IconButton
									Icon={AiOutlineCalendar}
									color="secondary"
									ariaLabel="Plan"
								/>
								<motion.div
									layout
									style={{ position: "relative", zIndex: "2" }}
								>
									<IconButton
										onClick={() => setShowEmojisMenu((prev) => !prev)}
										Icon={BsEmojiSmile}
										color="secondary"
										ariaLabel="Emoji"
									/>
									{showEmojisMenu && (
										<Picker
											onSelect={handleAddEmoji}
											style={{
												position: "absolute",
												left: "-125px",
												width: "300px",
												borderRadius: "16px",
											}}
											theme="dark"
										/>
									)}
								</motion.div>
								<IconButton Icon={BiPoll} color="secondary" ariaLabel="Poll" />
							</TweetToolbarLeftCol>
							{!isInModal && (
								<TweetToolbarRightCol>
									{!!tweetValue.length && tweetValue.trim() && (
										<>
											<TweetLengthInfoCol>
												<span>{`${tweetValue.length} / 250`}</span>
											</TweetLengthInfoCol>
											<CircleTweetLengthProgressContainer>
												<CircleTweetLengthProgressBar
													progress={(tweetValue.length / 250) * 100}
												/>
											</CircleTweetLengthProgressContainer>
										</>
									)}
									<motion.div layout>
										<CustomButton
											disabled={disableCreateTweetButton}
											onClick={handleCreateTweet}
										>
											Tweet
										</CustomButton>
									</motion.div>
								</TweetToolbarRightCol>
							)}
						</TweetToolbar>
					</TweetRightColumn>
				</TweetContainerInner>
			</TweetContainer>
		</>
	);
};

export default CreateTweetForm;

const TweetContainer = styled(motion.div)`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const TweetContainerInner = styled(motion.div)`
	display: flex;
	flex-grow: 1;
	padding: 6px 16px;
`;

const TweetLeftColumn = styled(motion.div)`
	display: flex;
	flex-direction: column;
	flex-basis: 48px;
	margin-right: 12px;
`;

const TweetRightColumn = styled(motion.div)`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;

const TweetToolbar = styled(motion.div)`
	display: flex;
	margin: 12px 0 8px 0;
	align-items: center;
	justify-content: space-between;
	gap: 0 10px;
`;

const TweetToolbarLeftCol = styled(motion.div)`
	display: flex;
	align-items: center;
	margin-left: -6px;
`;

const TweetToolbarRightCol = styled.div`
	display: flex;
	align-items: center;
	gap: 0 15px;
`;

const TweetLengthInfoCol = styled.div`
	color: ${({ theme }) => theme.colors.text.secondary};
`;

const CircleTweetLengthProgressContainer = styled.div`
	position: relative;
	height: 20px;
	width: 20px;
	background: ${({ theme }) => theme.colors.background.secondary};
	border-radius: 50%;

	&::before {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 16px;
		width: 16px;
		background: ${({ theme }) => theme.colors.background.primary};
		border-radius: 50%;
		z-index: 6;
	}
`;

const CircleTweetLengthProgressBar = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 50%;
	transition: 0.2s;
	background: ${({ theme, progress }) =>
		`conic-gradient(${theme.colors.color.primary} ${progress}%, ${theme.colors.background.secondary} ${progress}%)`};
`;

const TweetImageContainer = styled(motion.div)`
	position: relative;
	display: flex;
	max-height: 625px;
	margin-top: 12px;
	border-radius: 16px;
	border: 1px solid ${({ theme }) => theme.colors.border.primary};
	background-color: rgba(255, 255, 255, 0.15);
	overflow: hidden;
`;

const TweetImageInner = styled(motion.div)`
	position: relative;
	display: block;
	width: 100%;
	border-radius: 16px;
`;

const RemoveImage = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(30px, 13px);
	display: grid;
	place-items: center;
	background: rgba(0, 0, 0, 0.6);
	border-radius: 50%;
	min-width: 26px;
	min-height: 26px;
	cursor: pointer;
	transition: transform 0.2s ease;
`;
