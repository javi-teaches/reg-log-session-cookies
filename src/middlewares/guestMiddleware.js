function guestMiddleware (req, res, next) {
	if (req.session.userId != undefined) {
		return res.redirect('/users/profile');
	}
	next();
}

module.exports = guestMiddleware;