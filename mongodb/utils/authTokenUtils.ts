import jwt from "jsonwebtoken";
import cookie from "cookie";
import { Request, Response } from "express";

interface AccessTokenPayload {
	userId: string;
}

interface RefreshTokenPayload {
	userId: string;
	version: number;
}

enum TokenExpiration {
	Access = 30 * 60,
	Refresh = 30 * 24 * 60 * 60,
}

const defaultCookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_DEV !== "development",
	sameStie: "strict",
	path: "/",
};

function signAccessToken(payload: AccessTokenPayload) {
	return jwt.sign(payload, process.env.AUTH_ACCESS_TOKEN_SECRET, {
		expiresIn: TokenExpiration.Access,
	});
}

function signRefreshToken(payload: RefreshTokenPayload) {
	return jwt.sign(payload, process.env.AUTH_REFRESH_TOKEN_SECRET, {
		expiresIn: TokenExpiration.Refresh,
	});
}

export function buildAuthTokens(user) {
	const accessPayload: AccessTokenPayload = { userId: user._id };
	const refreshPayload: RefreshTokenPayload = {
		userId: user._id,
		version: user.tokenVersion,
	};

	const accessToken = signAccessToken(accessPayload);
	const refreshToken = signRefreshToken(refreshPayload);

	return {
		accessToken,
		refreshToken,
	};
}

export function setAuthTokens(res: Response, access: string, refresh?: string) {
	res.setHeader("Set-Cookie", [
		cookie.serialize("auth_access", access, {
			...defaultCookieOptions,
			maxAge: TokenExpiration.Access,
		}),
		refresh &&
			cookie.serialize("auth_refresh", refresh, {
				...defaultCookieOptions,
				maxAge: TokenExpiration.Refresh,
			}),
	]);
}

export function verifyAccessToken(token: string) {
	return jwt.verify(token, process.env.AUTH_ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string) {
	return jwt.verify(token, process.env.AUTH_REFRESH_TOKEN_SECRET);
}

export function refreshTokens(currentToken, tokenVersion: number) {
	if (tokenVersion !== currentToken.version) throw "Token revoked";

	const accessToken = signAccessToken({ userId: currentToken.userId });
	let refreshPayload: RefreshTokenPayload | undefined;
	const expiration = new Date(currentToken.exp);
	const secondsUntilExpiration =
		(expiration.getTime() - new Date().getTime()) / 1000;

	if (TokenExpiration.Refresh > secondsUntilExpiration) {
		refreshPayload = { userId: currentToken.userId, version: tokenVersion };
	}
	const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

	return { accessToken, refreshToken };
}

export function clearAuthTokens(res: Response) {
	res.setHeader("Set-Cookie", [
		cookie.serialize("auth_access", "", {
			...defaultCookieOptions,
			maxAge: 0,
		}),
		cookie.serialize("auth_refresh", "", {
			...defaultCookieOptions,
			maxAge: 0,
		}),
	]);
}
