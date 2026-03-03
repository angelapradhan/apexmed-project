const jwt = require("jsonwebtoken");

const authGuard = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Auth Header not found" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Token not found" });
    }

    try {
        const decodeData = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        req.user = decodeData; // Decode bhayeko data (id, role) req.user ma bascha
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

module.exports = authGuard;