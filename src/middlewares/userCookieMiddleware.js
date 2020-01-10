function userCookieMiddleware (req, res, next) {
	if (req.cookies.userIdCookie != undefined) {
		req.session.userId = req.cookies.userIdCookie;
	}
	next();
}

module.exports = userCookieMiddleware;