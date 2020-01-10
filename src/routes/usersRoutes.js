// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const diskStorage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, path.join(__dirname, '../../public/images/avatars'));
	},
	filename: function(req, file, cb){
		let userName = req.body.full_name.replace(/ /g, '_').toLowerCase();
		let imageFinalName = userName + '_'+ Date.now() + path.extname(file.originalname);
		cb(null, imageFinalName);
	}
});

const upload = multer({ storage: diskStorage });

// ************ Controller Require ************
const usersController = require('../controllers/usersController');

// ************ Middlewares ************
const authMiddleware = require('../middlewares/authMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');

/* GET - /users/register */
router.get('/register', guestMiddleware, usersController.register);

/* POST - /users/register */
router.post('/register', upload.single('avatar'), usersController.store);

/* GET - /users/login */
router.get('/login', guestMiddleware, usersController.login);

/* POST - /users/login */
router.post('/login', usersController.processLogin);

/* GET - /users/profile */
router.get('/profile', authMiddleware, usersController.profile);

/* GET - /users/logout */
router.get('/logout', usersController.logout);

module.exports = router;
