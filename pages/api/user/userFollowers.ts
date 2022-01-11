import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import User from "mongodb/models/User";

export default authMiddleware(async function handler(req, res) {
	const {
		method,
		query: { tag_name, profile_id },
	} = req;
	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					const { followers } = await User.findOne({
						tag_name: new RegExp("^" + tag_name + "$", "i"),
					}).select("followers");

					const followersPromise = await Promise.all(
						followers.map(async (userId) => {
							const user = await User.findById(userId).select(
								"+following +followers"
							);

							const isFollowed = Boolean(
								user.followers.find((follow) => follow === profile_id)
							);

							const isFollowsYou = Boolean(
								user.following.find((follow) => follow === profile_id)
							);

							return {
								...user._doc,
								isFollowed,
								isFollowsYou,
							};
						})
					);

					res.status(200).json(followersPromise);
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
