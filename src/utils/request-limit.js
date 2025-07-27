import { rateLimit, ipKeyGenerator } from 'express-rate-limit';


export const requestLimiter = (seconds, limit) => {
    const limitter = rateLimit({
        windowMs: seconds * 1000,
        limit,
        keyGenerator: (req, _res) => {
            return ipKeyGenerator(req.ip) || (req.body.username ?? req.body.phoneNumber);
        },
        message: {
            status: 429,
            message: 'Too many request'
        },
        legacyHeaders: true,
        standardHeaders: 'draft-6' || 'draft-7' || 'draft-8'
    });
    return limitter;
}