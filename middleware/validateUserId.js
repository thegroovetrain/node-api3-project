const userDB = require('../users/userDb');

module.exports = () => {
    return (req, res, next) => {
        userDB.getById(req.params.id).then(user => {
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(400).json({message: "invalid user id"});
            }
            
        }).catch(next)
    }
}