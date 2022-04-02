const db = require('./db')
 module.exports.register = async function register(user){
    const text = `
    INSERT INTO people (login, passwordd, rolee, phone)
    VALUES ($1, $2, $3, $4)
  `;
    const values = [user.login, user.passwordd, user.phone, user.rolee];
    return db.pool.query(text, values);
}
 module.exports.getUser = async function getUser(user) {
    const text = `SELECT * FROM people WHERE login = $1 and passwordd = $2`;
    const values = [user.login,user.passwordd];
    return db.pool.query(text, values);
}
module.exports.getAll = async function getAll(){
    return db.pool.query("SELECT * from people")
}
