const requiredEnvVars = [
    "PORT",
    "MONGODB_URL",
    "DB_NAME",
    "ACCESSTOKEN_SECRET",
    "REFRESHTOKEN_SECRET",
    "ACCESSTOKEN_EXPIRE",
    "REFRESH_EXPIRE",
    "CORS_ORIGIN",
];

export const validateEnv = () => {
    const missing = requiredEnvVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
};
