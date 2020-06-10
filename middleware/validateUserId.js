const userDB = require('../users/userDb');

module.exports = () => {
    return (req, res, next) {
        userDB.getById(req.params.id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            return res.status(400).json({message: "invalid user id"});
        })
    }
}