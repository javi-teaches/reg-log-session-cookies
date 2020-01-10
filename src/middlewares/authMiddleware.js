function authMiddleware (req, res, next) {
	if (req.session.userId == undefined) {
		return res.redirect('/users/login');
	}
	next();
}

module.exports = authMiddleware;