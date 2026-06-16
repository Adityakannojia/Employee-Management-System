import { getCache, setCache } from "../utils/cache.util.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const cacheMiddleware = (keyBuilder, ttl) => {
    return async (req, res, next) => {
        try {
            const key =
                typeof keyBuilder === "function"
                    ? keyBuilder(req)
                    : keyBuilder;

            const cachedData = await getCache(key);

            if (cachedData) {
                return res.status(200).json(
                    new ApiResponse(200, cachedData, "Fetched from cache")
                );
            }

            const originalJson = res.json.bind(res);

            res.json = (body) => {
                if (body?.success && body?.data) {
                    setCache(key, body.data, ttl);
                }
                return originalJson(body);
            };

            next();
        } catch {
            next();
        }
    };
};
