require('dotenv').config();

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const PORT = 3003;

module.exports = {
	MONGO_DB_URI,
	PORT,
};
