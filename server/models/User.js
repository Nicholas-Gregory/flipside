const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9_\.]+$/,
        unique: true
    },
    password: {
        type: String,
        required: true,
        set: p => bcrypt.hashSync(p, 10)
    },
    email: {
        type: String,
        required: true,
        match: /^[\w-\.!#\$&'*\+=?\^`\{\}|~\/]+@([\w-]+\.)+[\w-]{2,}$/,
        unique: true
    },
    bio: {
        type: String,
        maxLength: 300
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    incomingFriendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    outgoingFriendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }]
}, {
    methods: {
        compareHashedPassword (clearTextPassword) {
            return bcrypt.compareSync(clearTextPassword, this.password);
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;