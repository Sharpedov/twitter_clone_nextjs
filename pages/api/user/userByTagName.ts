import dbConnect from "mongodb/dbConnect";
import User from "mongodb/models/User";

export default async function handler(req, res) {
	const {
		method,
		query: { tag_name, profile_id },
	} = req;
	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					const user = await User.findOne({
						tag_name: new RegExp("^" + tag_name + "$", "i"),
					}).select("+followers");

					if (!user)
						return res
							.status(404)
							.json({ success: false, message: "This account does not exist" });

					const isFollowed = user.followers.find(
						(followId) => followId === profile_id
					);

					const userProperties = {
						...user._doc,
						isFollowed: !!isFollowed,
					};

					res.status(200).json(userProperties);
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
