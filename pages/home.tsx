import { AnimateSharedLayout, motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreateTweetForm from "src/components/form/createTweetForm";
import IconButton from "src/components/iconButton";
import TopBar from "src/components/topBar";
import Widgets from "src/components/widgets";
import { useUser } from "src/providers/userProvider";
import styled from "styled-components";
import { HiOutlineSparkles } from "react-icons/hi";
import SpinnerLoader from "src/components/loaders/spinnerLoader";
import TweetCard from "src/components/tweetCard";
import Feed from "src/components/feed";
import { useSWRInfinitePagination } from "src/hooks/useSWRInfinitePagination";
import { TweetType } from "src/types";
import TopBarMobile from "src/components/topBarMobile";

const mapState = (state) => ({
	createTweetLoading: state.tweet.create.loading,
});

export default function Home() {
	const { isLogged } = useUser();
	const {
		fetchedData,
		isLoadingInitialData,
		isLoadingMore,
		isEmpty,
		isReachedEnd,
		error,
		lastItemRef,
	} = useSWRInfinitePagination({
		queryKey: `/api/tweet/timeline?limit=${15}`,
	});
	const data: TweetType[] = fetchedData;
	const { createTweetLoading } = useSelector(mapState);
	const [tweetUploadImgLoading, setTweetUploadImgLoading] =
		useState<boolean>(false);
	const { replace } = useRouter();

	useEffect(() => {
		!isLogged && replace("/");
	}, [isLogged, replace]);

	return (
		<>
			<Head>
				<title>Latest Tweets / Twitter</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<Feed>
				<TopBar
					disableOnMobileView
					withoutIcon
					loading={tweetUploadImgLoading || createTweetLoading}
				>
					<TopBarInner>
						<h2>Latest Tweets</h2>
						<IconButton Icon={HiOutlineSparkles} ariaLabel="Sort tweets" />
					</TopBarInner>
				</TopBar>
				<TopBarMobile>
					<TopBarInner>
						<h2>Latest Tweets</h2>
						<IconButton Icon={HiOutlineSparkles} ariaLabel="Sort tweets" />
					</TopBarInner>
				</TopBarMobile>
				<AnimateSharedLayout>
					{isLogged && (
						<CreateTweetFormWrapper layout>
							<CreateTweetForm
								setTweetUploadImgLoading={setTweetUploadImgLoading}
							/>
						</CreateTweetFormWrapper>
					)}
					<TweetsContainer>
						{isLoadingInitialData ? (
							<SpinnerLoader center loading={true} />
						) : error ? (
							<div>{error.message}</div>
						) : (
							data.map((tweet) => (
								<TweetCard
									ref={lastItemRef}
									key={tweet._id}
									tweetData={tweet}
								/>
							))
						)}
						{isLoadingMore && !isLoadingInitialData && (
							<SpinnerLoader center loading={true} />
						)}
						{isEmpty && !isLoadingInitialData ? (
							<div>empty</div>
						) : (
							isReachedEnd && <div style={{ height: "200px" }} />
						)}
					</TweetsContainer>
				</AnimateSharedLayout>
			</Feed>
			<Widgets></Widgets>
		</>
	);
}

const TopBarInner = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;
	margin: 0 auto;

	& > h2 {
		flex-grow: 1;
		line-height: 24px;
		font-size: 17px;
		font-weight: 700;
	}

	@media ${({ theme }) => theme.breakpoints.md} {
		& > h2 {
			font-size: 20px;
		}
	}
`;

const CreateTweetFormWrapper = styled(motion.div)`
	display: none;

	@media ${({ theme }) => theme.breakpoints.md} {
		display: flex;
		border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
	}
`;

const TweetsContainer = styled.section`
	display: flex;
	flex-direction: column;
	width: 100%;
	border-top: 1px solid ${({ theme }) => theme.colors.border.primary};

	@media ${({ theme }) => theme.breakpoints.md} {
		border-top: 0px;
	}
`;
