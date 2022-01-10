import dbConnect from "mongodb/dbConnect";
import User from "mongodb/models/User";

export default async function handler(req, res) {
	const { method, body } = req;

	await dbConnect();

	switch (method) {
		case "POST":
			{
				try {
					const { email } = body;
					const existingUser = await User.findOne({ email });

					if (existingUser)
						return res.status(400).json({
							message: "This e-mail is already assigned to the account.",
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
