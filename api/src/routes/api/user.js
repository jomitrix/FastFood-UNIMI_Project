const router = require("express").Router();
const { authStrict, authLoose } = require("@middleware/authMiddleware");
const Users = require("@models/Users");

router.get("/get", authStrict, async (req, res, next) => {
    try {
        res.send({ status: "success", user: req.user });
    } catch (err) { next(err); }
});

module.exports = router;