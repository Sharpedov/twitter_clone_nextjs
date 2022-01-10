import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true, maxLength: 50 },
		tag_name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			maxLength: 25,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			select: false,
			maxLength: 80,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		profile_image_url: { type: String, default: "" },
		profile_banner_url: { type: String, default: "" },
		description: { type: String, maxLength: 160, default: "" },
		url: {
			type: String,
			validate:
				/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
			maxLength: 100,
		},
		location: { type: String, maxLength: 30, default: "" },
		followers: { type: [String], default: [], select: false },
		following: { type: [String], default: [], select: false },
		followers_count: { type: Number, default: 0 },
		following_count: { type: Number, default: 0 },
		tweet_count: { type: Number, default: 0 },
		tokenVersion: { type: Number, default: 0, select: false },
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
