import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
    // console.log(userId);

    // Generate the JWT token with the userId inside an object
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '15d', // Token expiration time
    });

    // Set the token in the cookie
    res.cookie('jwt', token, {
        maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days in milliseconds
        httpOnly: true, // Prevent JavaScript from accessing cookies
        sameSite: 'strict', // Prevent cross-site request forgery (CSRF)
        secure: process.env.MODE_APP !== 'development', // Use secure cookies in production
    });
};

export default generateTokenAndSetCookie;
