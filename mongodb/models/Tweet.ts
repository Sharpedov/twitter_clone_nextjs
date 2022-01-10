import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: [true, "Please provide a message."],
			maxlength: [255, "Message cannot be more than 255 characters"],
		},
		user_id: { type: String, required: true },
		tweet_image_url: { type: String, default: "" },
		hashtags: { type: [String], default: [] },
		favourite: { type: [String], default: 0, select: false },
		favourite_count: { type: Number, default: 0 },
		reply_count: { type: Number, default: 0 },
		retweet_count: { type: Number, default: 0 },
		padding_bottom: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);
