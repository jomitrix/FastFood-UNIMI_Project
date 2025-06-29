const router = require("express").Router();
const { authLoose } = require("@middleware/authMiddleware");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Users = require("@models/Users");
const Restaurants = require("@models/Users.Restaurants");
const Joi = require("joi");
const validator = require("@validators/authValidator");
const { validate } = require("@middleware/validationMiddleware");
const fs = require("fs");

router.post("/login", validate(validator.loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });
        if (!user) return res.status(400).send({ status: "error", error: "Credenziali non valide" });

        let validUser = await bcrypt.compare(password, user.password);
        if (!validUser) return res.status(400).send({ status: "error", error: "Credenziali non valide" });

        if (user.deleted) return res.status(400).send({ status: "error", error: "Utente in fase di eliminazione" });

        let token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

        res.send({ status: "success", token, verified: user.verified });
    } catch (err) { next(err); }
});

router.post("/register", validate(validator.registerSchema), async (req, res, next) => {
    try {
        const { username, email, password, name, surname } = req.body;

        const betterEmail = email.toLowerCase();

        const emailExists = await Users.findOne({ email: betterEmail });
        if (emailExists) return res.status(400).send({ status: "error", error: "Questa email è già registrata" });

        const usernameExists = await Users.findOne({ username });
        if (usernameExists) return res.status(400).send({ status: "error", error: "Username già utilizzato" });

        let hashedPassword = await bcrypt.hash(password, 10);

        let user = new Users({ username, email: betterEmail, password: hashedPassword, name, surname });
        await user.save();

        let token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

        res.send({ status: "success", token });
    } catch (err) { next(err); }
});

module.exports = router;