// Modules
const fs = require('fs');
const path = require('path');

// Constants
const userFilePath = path.join(__dirname, '../data/users.json');

// Helper Functions
function getAllUsers() {
	let usersFileContent = fs.readFileSync(userFilePath, 'utf-8');
	let finalUsers = usersFileContent == '' ? [] : JSON.parse(usersFileContent);
	return finalUsers;
}

function getUserById(id) {
	let allUsers = getAllUsers();
	let userById = allUsers.find(oneUser => oneUser.id == id);
	return userById;
}

const controller = {
	index: (req, res) => {
		let userLogged = getUserById(req.session.userId);
		res.render('index', { userLogged });
	},
};

module.exports = controller
