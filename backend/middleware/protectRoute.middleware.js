import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({
                success: false,
                msg: 'Unauthorized - No Token provided',
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({
                success: false,
                msg: 'Unauthorized - Invalid Token',
            });
        }

        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User Not Found',
            });
        }

        req.user = user
        next();

    } catch (error) {
        console.error("This error is from protectRoute.middleware.js protectRoute function:", error);

        return res.status(500).json({
            success: false,
            msg: 'Something went wrong. Please try again later.',
            error: error.message
        });
    }
}

export default protectRoute