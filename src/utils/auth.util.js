import crypto from "crypto";

export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

export const isBearerAuthMode = (req) => {
    return req.headers["x-auth-mode"] === "bearer";
};

const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
};

export const accessTokenCookieOptions = {
    ...cookieOptions,
    maxAge: Number(process.env.COOKIE_ACCESS_MAX_MS) || 60 * 60 * 1000,
};

export const refreshTokenCookieOptions = {
    ...cookieOptions,
    maxAge: Number(process.env.COOKIE_REFRESH_MAX_MS) || 7 * 24 * 60 * 60 * 1000,
};

export const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
};
