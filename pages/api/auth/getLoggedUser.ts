import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import User from "mongodb/models/User";
import { clearAuthTokens } from "mongodb/utils/authTokenUtils";

export default authMiddleware(async function handler(req, res) {
	await dbConnect();
	const user = await User.findOne({ _id: req.token.userId });
	if (!user) {
		clearAuthTokens(res);
		return res.json({ success: false });
	}
	res.json(user);
});
