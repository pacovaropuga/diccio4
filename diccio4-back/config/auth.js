require('dotenv').config()

module.exports = {

    secret: process.env.AUTH_SECRET,
    expires: process.env.EXPIRES,
    rounds: process.env.ROUNDS
    
}