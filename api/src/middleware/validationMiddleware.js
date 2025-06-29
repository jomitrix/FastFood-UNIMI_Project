const validate = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.body);
    if (error) return res.status(400).send({ status: "error", error: error.details[0].message });
    req.body = value;
    next();
};

module.exports = { validate };