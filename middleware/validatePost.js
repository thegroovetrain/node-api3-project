module.exports = () => {
    return (req, res, next) {
        if(!req.body) {
            return res.status(400).json({message: "missing post data"});
        } else if (!req.body.text) {
            return res.status(400).json({message: "missing required text field"});
        }

        next();
    }
}