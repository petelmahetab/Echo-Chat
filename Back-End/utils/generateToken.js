import jwt from 'jsonwebtoken';

const generateTokenANDSetCookie = (userId, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '10d', // Default to 7 days if not specified
    });

    // Set cookie with the token
    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        sameSite: 'strict', // Prevents CSRF attacks
        secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
    });
};

export default generateTokenANDSetCookie;