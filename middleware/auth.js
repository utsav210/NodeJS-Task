const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
};

const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({ message: "No refresh token provided!" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid refresh token!" });
    }
};

module.exports = {
    verifyToken,
    verifyRefreshToken
}; 