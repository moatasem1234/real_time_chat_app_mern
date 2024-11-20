import User from "../models/user.model.js";


export const getUsers = async (req, res) => {
    try {
        const authUserId = req.user._id
        const fillterdUsers = await User.find({ _id: { $ne: authUserId } }).select("-password")

        res.status(200).json({
            success: false,
            msg: 'get All users successfully',
            users: fillterdUsers
        })
    } catch (error) {
        console.error("This error is from user.controller.js getUsers function:", error);
        return res.status(500).json({
            success: false,
            msg: 'Something went wrong. Please try again later.',
            error: error.message
        });
    }
}
