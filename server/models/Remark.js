const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    body: {
        type: String,
        required: true
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    quote: { type: mongoose.Schema.Types.ObjectId, ref: 'Remark' },
    citations: [citationSchema],
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    likes: Number
});

const Remark = mongoose.model('Remark', remarkSchema);

module.exports = Remark;
