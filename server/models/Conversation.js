const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    replies: [this],
    likes: Number
});

const citationSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    link: String
});

const remarkSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    comments: [commentSchema],
    quote: this,
    citations: [citationSchema],
    likes: Number
});

const conversationSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    title: String,
    remarks: [remarkSchema]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;