const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9_\.]$/
    },
    password: {
        type: String,
        required: true,
        set: p => bcrypt.hashSync(p, 10)
    },
    email: {
        type: String,
        required: true,
        match: /^[\w-\.!#\$&'*\+=?\^`\{\}|~\/]+@([\w-]+\.)+[\w-]{2,}$/
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;