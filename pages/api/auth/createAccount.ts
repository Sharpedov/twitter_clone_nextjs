import dbConnect from "mongodb/dbConnect";
import User from "mongodb/models/User";
import bcrypt from "bcryptjs";
import { buildAuthTokens, setAuthTokens } from "mongodb/utils/authTokenUtils";

export default async function handler(req, res) {
	const { method, body } = req;

	await dbConnect();

	switch (method) {
		case "POST":
			{
				try {
					const { name, email, password, repeat_password, tag_name } = body;

					const existingEmail = await User.findOne({ email });
					const existingTagName = await User.findOne({
						tag_name: new RegExp("^" + tag_name + "$", "i"),
					}).select("tag_name");

					if (existingEmail || existingTagName || password !== repeat_password)
						return res
							.status(404)
							.json({ message: "We cannot create account. Try again." });

					if (password.length > 16)
						return res
							.status(404)
							.json({ message: "Password cannot be more than 16 characters" });

					const newUser = await User.create({
						name,
						tag_name,
						email,
						password: await bcrypt.hashSync(password, 12),
					});

					const { accessToken, refreshToken } = buildAuthTokens(newUser);

					setAuthTokens(res, accessToken, refreshToken);

					res.status(201).json({ success: true });
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
