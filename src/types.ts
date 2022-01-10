export type UserType = {
	name: string;
	tag_name: string;
	profile_image_url: string;
	profile_banner_url: string;
	description: string;
	url: string;
	location: string;
	followers_count: number;
	following_count: number;
	tweet_count: number;
	_id: string;
	isFollowed: boolean;
	isFollowsYou: boolean;
	myProfile: boolean;
	createdAt: number;
	updatedAt: number;
};

export type TweetType = {
	_id: string;
	text: string;
	user_id: string;
	tweet_image_url: string;
	hashtags: string[];
	favourite_count: number;
	reply_count: number;
	retweet_count: number;
	padding_bottom: number;
	createdAt: number;
	updatedAt: number;
	user: UserType;
};
