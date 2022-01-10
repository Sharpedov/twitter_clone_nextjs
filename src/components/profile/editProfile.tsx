import React, { useCallback, useEffect, useRef, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import styled from "styled-components";
import IconButton from "../iconButton";
import CustomButton from "../button";
import SkeletonLoader from "../loaders/skeletonLoader";
import { useUser } from "src/providers/userProvider";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { Avatar } from "@mui/material";
import {
	Controller,
	FormProvider,
	SubmitHandler,
	useForm,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../input";
import { uploadFile } from "src/utils/uploadFile";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "src/store/slices/userSlice";
import { addNotification } from "src/store/slices/notificationsSlice";
import TopBar from "../topBar";

interface FormInputs {
	name: string;
	description: string;
	location: string;
	url: string;
}

interface Props {
	onClose: () => void;
}

const yupSchema = yup.object().shape({
	name: yup
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(50, "Name must be at most 50 characters")
		.required("Name is required"),
	description: yup
		.string()
		.max(160, "Description must be at most 160 characters"),
	location: yup.string().max(30, "Location must be at most 30 characters"),
	url: yup
		.string()
		.url("Website must be a valid URL")
		.max(100, "Website url must be at most 100 characters"),
});

const mapState = (state) => ({
	updateLoading: state.user.update.loading,
});

const EditProfile: React.FC<Props> = ({ onClose }) => {
	const { user, loading, mutate } = useUser();
	const methods = useForm<FormInputs>({ resolver: yupResolver(yupSchema) });
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = methods;
	const { updateLoading } = useSelector(mapState);
	const buttonSubmitRef = useRef(null!);
	const profileBannerPickerRef = useRef(null!);
	const profileImagePickerRef = useRef(null!);
	const [profileBannerUrl, setProfileBannerUrl] = useState<string>("");
	const [profileBannerLoading, setProfileBannerLoading] =
		useState<boolean>(false);
	const [profileImageUrl, setProfileImageUrl] = useState<string>("");
	const [profileImageLoading, setProfileImageLoading] =
		useState<boolean>(false);
	const dispatch = useDispatch();

	const handleAddProfileBanner = useCallback(
		async (e) => {
			if (!!e.target.files[0]) {
				const file = e.target.files[0] as File;
				setProfileBannerLoading(true);

				if (file.size >= 4 * 1024 * 1024) {
					setProfileBannerLoading(false);
					return dispatch(addNotification({ message: "File is too big" }));
				}

				const [data, err] = await uploadFile({ file });

				setProfileBannerLoading(false);
				if (err) return dispatch(addNotification({ message: err }));

				setProfileBannerUrl(data);
				return;
			}
		},
		[dispatch]
	);

	const handleAddProfileImage = useCallback(
		async (e) => {
			if (!!e.target.files[0]) {
				const file = e.target.files[0] as File;
				setProfileImageLoading(true);

				if (file.size >= 3 * 1024 * 1024) {
					setProfileImageLoading(false);
					return dispatch(addNotification({ message: "File is too big" }));
				}

				const [data, err] = await uploadFile({ file });

				setProfileImageLoading(false);
				if (err) return dispatch(addNotification({ message: err }));

				setProfileImageUrl(data);
				return;
			}
		},
		[dispatch]
	);

	const handleOnSubmit: SubmitHandler<FormInputs> = useCallback(
		(data: FormInputs) => {
			console.log("data", data);

			dispatch(
				updateProfile({
					...data,
					tag_name: user.tag_name,
					profileBannerUrl,
					profileImageUrl,
					onComplete: () => {
						mutate();
						onClose();
					},
				})
			);
		},
		[
			dispatch,
			profileBannerUrl,
			profileImageUrl,
			user.tag_name,
			mutate,
			onClose,
		]
	);

	useEffect(() => {
		if (user) {
			setProfileBannerUrl(user.profile_banner_url);
			setProfileImageUrl(user.profile_image_url);
		}
	}, [user]);

	return (
		<Container>
			<TopBar
				loading={
					loading ||
					profileBannerLoading ||
					profileImageLoading ||
					updateLoading
				}
				text="Edit profile"
				onClose={() => onClose()}
			>
				<CustomButton
					color="secondary"
					size="small"
					disabled={
						profileImageLoading || profileBannerLoading || updateLoading
					}
					onClick={() => buttonSubmitRef.current.click()}
				>
					Save
				</CustomButton>
			</TopBar>

			<ProfileBanner loading={loading}>
				<ProfileBannerInner>
					{loading || profileBannerLoading ? (
						<SkeletonLoader absolute radiusNone />
					) : (
						<ProfileBannerInnerPic bannerUrl={profileBannerUrl} />
					)}
				</ProfileBannerInner>
				<div
					style={{
						display: "flex",
						gap: "25px",
						position: "absolute",
						color: "#fff",
						opacity: "0.75",
					}}
				>
					<IconButton
						Icon={MdOutlinePhotoCamera}
						ariaLabel="Add photo"
						size="large"
						onClick={() => profileBannerPickerRef.current.click()}
					>
						<input
							ref={profileBannerPickerRef}
							type="file"
							onChange={(e) => handleAddProfileBanner(e)}
							hidden
							accept="image/png, image/jpeg"
						/>
					</IconButton>
					{profileBannerUrl && (
						<IconButton
							Icon={CloseRoundedIcon}
							ariaLabel="Remove photo"
							size="large"
							onClick={() => setProfileBannerUrl("")}
						/>
					)}
				</div>
			</ProfileBanner>
			<ProfileImage>
				<div style={{ paddingBottom: "100%" }} />
				<ProfileImageAvatarInner>
					<div
						style={{
							position: "absolute",
							color: "#fff",
							opacity: "0.75",
							zIndex: "1",
						}}
					>
						<IconButton
							Icon={MdOutlinePhotoCamera}
							ariaLabel="Add photo"
							size="large"
							onClick={() => profileImagePickerRef.current.click()}
						>
							<input
								ref={profileImagePickerRef}
								type="file"
								onChange={(e) => handleAddProfileImage(e)}
								hidden
								accept="image/png, image/jpeg"
							/>
						</IconButton>
					</div>
					<ProfileImageAvatar src={profileImageUrl} />
				</ProfileImageAvatarInner>
			</ProfileImage>
			<FormProvider {...methods}>
				<Form onSubmit={handleSubmit(handleOnSubmit)}>
					<Controller
						control={control}
						name="name"
						defaultValue={user.name}
						render={({ field }) => (
							<InputRow>
								<Input
									field={field}
									label="Name"
									error={errors.name && errors.name.message}
								/>
							</InputRow>
						)}
					/>
					<Controller
						control={control}
						name="description"
						defaultValue={user.description}
						render={({ field }) => (
							<InputRow>
								<Input
									field={field}
									label="About me"
									error={errors.description && errors.description.message}
								/>
							</InputRow>
						)}
					/>
					<Controller
						control={control}
						name="location"
						defaultValue={user.location}
						render={({ field }) => (
							<InputRow>
								<Input
									field={field}
									label="Location"
									error={errors.location && errors.location.message}
								/>
							</InputRow>
						)}
					/>
					<Controller
						control={control}
						name="url"
						defaultValue={user.url ?? ""}
						render={({ field }) => (
							<InputRow>
								<Input
									field={field}
									label="Website"
									error={errors.url && errors.url.message}
								/>
							</InputRow>
						)}
					/>
					<button ref={buttonSubmitRef} type="submit" hidden>
						submit
					</button>
				</Form>
			</FormProvider>
		</Container>
	);
};

export default EditProfile;

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

const ProfileBanner = styled.div`
	position: relative;
	display: grid;
	place-items: center;
	background-color: ${({ loading }) => !loading && "rgb(47, 51, 54)"};
	overflow: hidden;
	margin: 0 2px;
`;

const ProfileBannerInner = styled.div`
	position: relative;
	display: block;
	padding-bottom: 33.3333%;
	width: 100%;
`;

const ProfileBannerInnerPic = styled.div`
	position: absolute;
	top: 0px;
	bottom: 0px;
	right: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background-image: ${({ bannerUrl }) => `url(${bannerUrl})`};
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center center;

	&::after {
		content: "";
		position: absolute;
		inset: 0px;
		background-color: rgba(0, 0, 0, 0.3);
	}
`;

const ProfileImage = styled.div`
	position: relative;
	max-width: 110px;
	background-color: #000;
	margin-top: -8%;
	margin-left: 16px;
	margin-bottom: 1px;
	width: 24%;
	border-radius: 50%;
`;

const ProfileImageAvatarInner = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0px;
	left: 0px;
	bottom: 0px;
	display: grid;
	place-items: center;
	background-color: rgb(45, 49, 51);
	border-radius: 50%;

	&::before {
		content: "";
		position: absolute;
		inset: 0px;
		transform: translate(-2px, -2px);
		border-radius: 50%;
		height: calc(100% + 4px);
		width: calc(100% + 4px);
		border: 2px solid #000;
	}

	&::after {
		content: "";
		position: absolute;
		inset: 0px;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50%;
	}
`;

const ProfileImageAvatar = styled(Avatar)`
	width: 100%;
	height: 100%;
	box-shadow: rgba(255, 255, 255, 0.03) 0px 0px 2px inset;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const InputRow = styled.div`
	padding: 0px 16px;
`;
