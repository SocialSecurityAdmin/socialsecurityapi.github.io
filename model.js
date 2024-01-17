const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    ip_pin: Number,
    ssn: Number
})
const userModel = mongoose.model('users', userSchema)
module.exports = userModel