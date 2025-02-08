import jwt from 'jsonwebtoken';

const generateTokenANDSetCookie = (userId, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '10d',
    });

    // Set cookie with the token
    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
};

export default generateTokenANDSetCookie;