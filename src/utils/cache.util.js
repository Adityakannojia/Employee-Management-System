import redis from "../config/redis.config.js";

const DEFAULT_TTL = Number(process.env.CACHE_TTL) || 300;

export const getCache = async (key) => {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("Cache GET error:", err.message);
        return null;
    }
};

export const setCache = async (key, value, ttl = DEFAULT_TTL) => {
    try {
        await redis.setex(key, ttl, JSON.stringify(value));
    } catch (err) {
        console.error("Cache SET error:", err.message);
    }
};

export const deleteCache = async (key) => {
    try {
        await redis.del(key);
    } catch (err) {
        console.error("Cache DEL error:", err.message);
    }
};

export const deleteCacheByPattern = async (pattern) => {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (err) {
        console.error("Cache pattern DEL error:", err.message);
    }
};
