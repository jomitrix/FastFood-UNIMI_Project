const jwt = require("jsonwebtoken");
const Users = require("@models/Users");

function authMiddleware() {
    return async (req, res, next) => {
        const authHeader = req.header("Authorization");
        if (!authHeader) return res.status(403).json({ status: "error", error: "Unauthorized" });

        const token = authHeader.replace("Bearer ", "");
        
        let verifiedToken;
        try {
            verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (error) {
            return res.status(403).json({ status: "error", error: "Unauthorized" });
        }

        try {
            const user = await Users.findById(verifiedToken._id).select("-password -__v").lean();
            if (!user) return res.status(403).json({ status: "error", error: "Unauthorized" });

            if (user.deleted) return res.status(403).json({ status: "error", error: "Unauthorized" });

            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({ status: "error", error: "Unauthorized" });
        }
    };
}

const authStrict = authMiddleware();

module.exports = { 
    authMiddleware,
    authStrict
};
