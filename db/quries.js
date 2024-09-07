const pool = require("./pool");

// Example of a query function
const findUserByEmail = (email) => {
  return pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

module.exports = {
  findUserByEmail,
  // Add other query functions here
};
