import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import Tweet from "mongodb/models/Tweet";
import User from "mongodb/models/User";

export default authMiddleware(async function handler(req, res) {
	const { method, body } = req;
	await dbConnect();

	switch (method) {
		case "POST":
			{
				try {
					const { text, user_id, tweet_image_url, padding_bottom } = body;
					const tweet = await Tweet.create({
						text: text.trim(),
						user_id,
						tweet_image_url: tweet_image_url ? tweet_image_url.trim() : "",
						padding_bottom,
					});
					const user = await User.findByIdAndUpdate(user_id, {
						$inc: { tweet_count: 1 },
					});

					res.status(201).json(tweet);
				} catch (error) {
					res.status(400).json({ success: false, message: error.message });
				}
			}
			break;
		default:
			res.status(500).json({ success: false });
			break;
	}
});
