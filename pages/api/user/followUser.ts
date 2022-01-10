import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import User from "mongodb/models/User";

export default authMiddleware(async function handler(req, res) {
	const {
		method,
		body: { profile_id, tag_name },
	} = req;
	await dbConnect();

	switch (method) {
		case "PATCH": {
			try {
				const followingUser = await User.findOneAndUpdate(
					{
						tag_name: new RegExp("^" + tag_name + "$", "i"),
					},
					{
						$addToSet: {
							followers: profile_id,
						},
						$inc: { followers_count: 1 },
					},
					{
						new: true,
					}
				);

				if (!followingUser)
					return res.status(404).json({ message: "Something went wrong" });

				const user = await User.findByIdAndUpdate(
					profile_id,
					{
						$addToSet: { following: followingUser._id },
						$inc: { following_count: 1 },
					},
					{ new: true }
				);

				if (!user)
					return res.status(404).json({ message: "Something went wrong" });

				res.status(200).json({ success: true });
			} catch (error) {
				res.status(400).json({ success: false, message: error.message });
			}
			break;
		}
		default:
			res.status(500).json({ success: false });
			break;
	}
});
