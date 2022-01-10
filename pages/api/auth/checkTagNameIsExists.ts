import dbConnect from "mongodb/dbConnect";
import User from "mongodb/models/User";

export default async function handler(req, res) {
	const { method, body } = req;

	await dbConnect();

	switch (method) {
		case "POST":
			{
				try {
					const { tag_name } = body;
					const existingUser = await User.findOne({
						tag_name: new RegExp("^" + tag_name + "$", "i"),
					}).select("tag_name");

					if (existingUser)
						return res.status(400).json({
							message: "This tag name is already exists.",
						});

					res.status(200).json({ success: true });
				} catch (error) {
					res.status(400).json({ message: error.message });
				}
			}
			break;
		default:
			res.status(500).json({ success: false });
			break;
	}
}
