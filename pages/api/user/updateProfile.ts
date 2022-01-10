import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import User from "mongodb/models/User";

export default authMiddleware(async function handler(req, res) {
	const { method, body } = req;
	await dbConnect();

	switch (method) {
		case "PATCH":
			{
				try {
					const {
						tag_name,
						name,
						profile_banner_url,
						profile_image_url,
						description,
						location,
						url,
					} = body;
					const user = await User.findOneAndUpdate(
						{
							tag_name: new RegExp("^" + tag_name + "$", "i"),
						},
						{
							name,
							profile_banner_url,
							profile_image_url,
							description,
							location,
							url,
						}
					);

					if (!user) return res.status(404).send("User not exists");

					res.status(200).json({ success: true });
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
