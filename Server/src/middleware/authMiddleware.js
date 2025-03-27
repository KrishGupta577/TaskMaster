import { ClerkExpressRequireAuth, verifyToken } from '@clerk/clerk-sdk-node';

const clerkAuth = async (req, res, next) => {
    try {

        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ message: "Token not provided." })
        }

        // Decode and verify the token using Clerk
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY, // Ensure this is set
        });

        if (!payload || !payload.sub) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // Attach the user info to the request
        req.user = {
            userId: payload.sub, // Clerk User ID
            email: payload.email, // User's email (if available)
        };

        next();
    } catch (error) {
        console.error("❌ Clerk Auth Error:", error);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

export default clerkAuth;
