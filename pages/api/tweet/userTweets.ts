import dbConnect from "mongodb/dbConnect";
import Tweet from "mongodb/models/Tweet";
import User from "mongodb/models/User";

export default async function handler(req, res) {
	const {
		method,
		query: { userId },
	} = req;
	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					const page = parseInt(req.query.page);
					const limit = parseInt(req.query.limit);

					const startIndex = (Number(page) - 1) * Number(limit);

					const tweets = await Tweet.find({ user_id: userId })
						.sort({
							createdAt: -1,
						})
						.limit(limit)
						.skip(startIndex);

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
}
