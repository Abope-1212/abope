module.exports = (req, res, next) => {
    if (!req.session.SignIn) {
        return res.redirect('/login');
    }
    next();
}