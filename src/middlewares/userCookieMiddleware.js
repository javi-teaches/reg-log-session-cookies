function userCookieMiddleware (req, res, next) {
	res.locals.isLogged = false;

	if (req.cookies.userCookie || req.session.userId) {		
		req.session.userId = req.cookies.userCookie ? req.cookies.userCookie : req.session.userId;
		res.locals.isLogged = true;
	}

	next();
}

module.exports = userCookieMiddleware;