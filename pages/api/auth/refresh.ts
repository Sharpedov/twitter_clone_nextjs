import dbConnect from "mongodb/dbConnect";
import User from "mongodb/models/User";
import {
	refreshTokens,
	setAuthTokens,
	verifyRefreshToken,
} from "mongodb/utils/authTokenUtils";

export default async function handler(req, res) {
	const { method } = req;

	await dbConnect();

	switch (method) {
		case "POST": {
			try {
				const currentToken = verifyRefreshToken(req.cookies.auth_refresh);
				const user = await User.findById(currentToken.userId);

				if (!user)
					return res
						.status(404)
						.json({ message: "User with that id does not exists" });

				const { accessToken, refreshToken } = refreshTokens(
					currentToken,
					user.tokenVersion
				);
				setAuthTokens(res, accessToken, refreshToken);

				res.json({ success: true });
			} catch (error) {
				res.status(400).json({ message: error.message });
			}
			break;
		}
		default:
			res.status(500).json({ success: false });
			break;
	}
}
