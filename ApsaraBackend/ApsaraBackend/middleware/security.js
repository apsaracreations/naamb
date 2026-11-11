import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Security headers. CSP is off because the storefront loads Razorpay, Google
// login and EmailJS scripts; popups are allowed so Google sign-in keeps working.
export const securityHeaders = helmet({
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

// Brute-force protection for login / register (per IP)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again in 15 minutes" },
});

// General API limit, generous enough for normal browsing
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests, slow down" },
});

// Blocks MongoDB operator injection, e.g. { "email": { "$ne": null } } in a login body.
// Drops any key that starts with "$" or contains "." from the request body.
const clean = (value) => {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (key.startsWith("$") || key.includes(".")) delete value[key];
      else value[key] = clean(value[key]);
    }
  }
  return value;
};

export const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === "object") clean(req.body);
  next();
};
