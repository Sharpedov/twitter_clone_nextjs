import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import Tweet from "mongodb/models/Tweet";
import User from "mongodb/models/User";

export default authMiddleware(async function handler(req, res) {
	const { method } = req;
	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					const page = parseInt(req.query.page as string);
					const limit = parseInt(req.query.limit as string);

					const startIndex = (Number(page) - 1) * Number(limit);

					const tweets = await Tweet.find({}).sort({ createdAt: -1 });

					const tweetsPromise = await Promise.all(
						tweets.map(async (tweet) => {
							const user = await User.findById(tweet.user_id);

							return {
								...tweet._doc,
								user,
							};
						})
					);

					res.status(200).json(tweetsPromise);
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
