import moment from "moment";
import React from "react";
import { TweetType } from "src/types";
import styled from "styled-components";
import AvatarProfile from "../profile/avatarProfile";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { BiMessageRounded } from "react-icons/bi";
import { AiOutlineRetweet } from "react-icons/ai";
import { IoHeartOutline } from "react-icons/io5";
import IconButton from "../iconButton";

interface Props {
	tweetData: TweetType;
}
type RefType = HTMLDivElement;

const TweetCard = React.forwardRef(
	({ tweetData }: Props, ref: React.ForwardedRef<RefType>) => {
		const {
			text,
			favourite_count,
			reply_count,
			retweet_count,
			createdAt,
			tweet_image_url,
			padding_bottom,
			user: { name, profile_image_url, tag_name },
		} = tweetData;

		return (
			<Card
				ref={ref}
				layout
				tabIndex={0}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<TweetCardInner layout>
					<TweetCardInnerLeftColumn layout>
						<motion.div layout>
							<AvatarProfile
								src={profile_image_url}
								loading={false}
								userTagName={tag_name}
								size={48}
							/>
						</motion.div>
					</TweetCardInnerLeftColumn>
					<TweetCardInnerRightColumn layout>
						<TweetCardInnerRightColumnRow1 layout>
							<motion.div layout>
								<Link href={`/${tag_name}`} passHref>
									<motion.a layout href={`/${tag_name}`}>
										<motion.span layout>
											<motion.span layout>{name}</motion.span>
											<motion.span
												layout
												className="tweetCard__tTweetCardInnerRightColumnRowSpan"
												style={{ marginLeft: "4px" }}
											>
												{`@${tag_name}`}
											</motion.span>
										</motion.span>
									</motion.a>
								</Link>
								<motion.span
									layout
									className="tweetCard__tTweetCardInnerRightColumnRowSpan"
								>
									<motion.span layout style={{ padding: "0 4px" }}>
										·
									</motion.span>
									{moment(createdAt).fromNow()}
								</motion.span>
							</motion.div>
							<motion.div layout>
								<MoreHorizIcon />
							</motion.div>
						</TweetCardInnerRightColumnRow1>
						<TweetCardInnerRightColumnRow2 layout>
							<TweetTextContainer layout>
								<motion.span layout>{text}</motion.span>
							</TweetTextContainer>
							<AnimatePresence>
								{!!tweet_image_url && (
									<TweetImageContainer layout>
										<TweetImageInner layout>
											<motion.div
												layout
												style={{
													paddingBottom: `${padding_bottom}%`,
												}}
											/>
											<Image
												src={tweet_image_url}
												alt="Image"
												layout="fill"
												objectFit="cover"
											/>
										</TweetImageInner>
									</TweetImageContainer>
								)}
							</AnimatePresence>
							<TweetToolBar layout>
								<IconButton
									Icon={BiMessageRounded}
									ariaLabel="Response"
									isInTweetCard
								/>
								<IconButton
									Icon={AiOutlineRetweet}
									ariaLabel="Retweet"
									isInTweetCard
								/>
								<IconButton
									Icon={IoHeartOutline}
									ariaLabel="Like"
									isInTweetCard
								/>
								<div />
							</TweetToolBar>
						</TweetCardInnerRightColumnRow2>
					</TweetCardInnerRightColumn>
				</TweetCardInner>
			</Card>
		);
	}
);
TweetCard.displayName = "TweetCard";

export default TweetCard;

const Card = styled(motion.article)`
	display: flex;
	border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
	padding: 12px 16px 0;
	transition: background-color 0.2s ease, box-shadow 0.2s ease;
	outline: none;
	cursor: pointer;

	&:focus-visible {
		box-shadow: rgb(199, 230, 252) 0px 0px 0px 2px inset;
		background-color: rgba(255, 255, 255, 0.08);
	}

	&:hover {
		background-color: rgba(255, 255, 255, 0.03);
	}
`;

const TweetCardInner = styled(motion.div)`
	display: flex;
	flex-grow: 1;
`;

const TweetCardInnerLeftColumn = styled(motion.div)`
	display: flex;
	flex-direction: column;
	flex-grow: 0;
	flex-basis: 48px;
	margin-right: 12px;
`;

const TweetCardInnerRightColumn = styled(motion.div)`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	padding-bottom: 12px;
`;

const TweetCardInnerRightColumnRow1 = styled(motion.div)`
	display: flex;
	gap: 0 5px;
	margin-bottom: 2px;
	justify-content: space-between;

	& > div {
		font-size: 15px;
		line-height: 20px;
		font-weight: 700;
		display: flex;
		flex-wrap: wrap;

		& > a {
			display: inline;
			overflow-wrap: break-word;
			min-width: 0px;
			max-width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			direction: ltr;
			unicode-bidi: isolate;
			outline: none;
			flex-wrap: wrap;

			&:focus-visible {
				& > span:nth-child(1) {
					flex-wrap: wrap;
					& > span:nth-child(1) {
						flex-wrap: wrap;
						text-decoration: underline;
					}
				}
			}

			& > span:nth-child(1) {
				&:hover {
					& > span:nth-child(1) {
						text-decoration: underline;
					}
				}
			}
		}
	}

	& .tweetCard__tTweetCardInnerRightColumnRowSpan {
		color: ${({ theme }) => theme.colors.text.secondary};
		font-weight: 400;
	}
`;

const TweetCardInnerRightColumnRow2 = styled(motion.div)`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;

const TweetTextContainer = styled(motion.div)`
	display: inline;
	font-weight: 400;
	font-size: 15px;
	line-height: 20px;
	overflow-wrap: break-word;
`;

const TweetImageContainer = styled(motion.div)`
	position: relative;
	display: flex;
	max-height: 525px;
	margin-top: 12px;
	border-radius: 16px;
	border: 1px solid ${({ theme }) => theme.colors.border.primary};
	overflow: hidden;
`;

const TweetImageInner = styled(motion.div)`
	position: relative;
	display: block;
	width: 100%;
	border-radius: 16px;
`;

const TweetToolBar = styled(motion.div)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0 8px;
	max-width: 425px;
	margin-top: 12px;
	margin-left: -6px;
`;
