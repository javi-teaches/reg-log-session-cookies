// Modules
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

// Constants
const userFilePath = path.join(__dirname, '../data/users.json');

// Helper Functions
function getAllUsers() {
	let usersFileContent = fs.readFileSync(userFilePath, 'utf-8');
	let finalUsers = usersFileContent == '' ? [] : JSON.parse(usersFileContent);
	return finalUsers;
}

function storeUser(newUserData) {
	// Traer a todos los usuarios
	let allUsers = getAllUsers();
	// Generar el ID y asignarlo al nuevo usuario
	newUserData = {
		id: generateUserId(),
		...newUserData
	};
	// Insertar el nuevo usuario en el array de TODOS los usuarios
	allUsers.push(newUserData);
	// Volver a reescribir el users.json
	fs.writeFileSync(userFilePath, JSON.stringify(allUsers, null, ' '));
}

function generateUserId() {
	let allUsers = getAllUsers();
	if (allUsers.length == 0) {
		return 1;
	}
	let lastUser = allUsers.pop();
	return lastUser.id + 1;
}

function getUserByEmail(email) {
	let allUsers = getAllUsers();
	let userByEmail = allUsers.find(oneUser => oneUser.email == email);
	return userByEmail;
}

function getUserById(id) {
	let allUsers = getAllUsers();
	let userById = allUsers.find(oneUser => oneUser.id == id);
	return userById;
}

// Controller Methods
const controller = {
	register: (req, res) => {
		const isLogged = req.session.userId ? true : false;
		
		res.render('usersRegisterForm', { isLogged });
	},
	store: (req, res) => {		
		// Hash del password
		req.body.password = bcrypt.hashSync(req.body.password, 10);

		// Eliminar la propiedad re_password
		delete req.body.re_password;

		// Asignar el nombre final de la imagen
		req.body.avatar = req.file.filename;

		// Guardar al usario
		storeUser(req.body);

		// Redirección al login
		res.redirect('/users/login');
	},
	login: (req, res) => {
		const isLogged = req.session.userId ? true : false;
		res.render('usersLoginForm', { isLogged });
	},
	processLogin: (req, res) => {
		// Buscar usuario por email
		let user = getUserByEmail(req.body.email);		

		// Si encontramos al usuario
		if (user != undefined) {
			// Al ya tener al usuario, comparamos las contraseñas
			if (bcrypt.compareSync(req.body.password, user.password)) {
				// Setear en session el ID del usuario
				req.session.userId = user.id;

				// Setear la cookie
				if (req.body.remember_user) {
					res.cookie('userIdCookie', user.id, { maxAge: 60000 * 60 });
				}

				// Redireccionamos al visitante a su perfil
				res.redirect(`/users/profile/`);
			} else {
				res.send('Credenciales inválidas');
			}
		} else {
			res.send('No hay usuarios registrados con ese email');
		}
	},
	profile: (req, res) => {
		const isLogged = req.session.userId ? true : false;
		let userLogged = getUserById(req.session.userId);
		res.render('userProfile', { isLogged, userLogged });
	},
	logout: (req, res) => {
		// Destruir la session
		req.session.destroy();
		// Destruir la cookie
		res.cookie('userIdCookie', null, { maxAge: 1 });
		return res.redirect('/');
	}
};

module.exports = controller
