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
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    body: {
        type: String,
        required: true
    },
    comments: [commentSchema],
    quote: { type: mongoose.Schema.Types.ObjectId, ref: 'Remark' },
    citations: [citationSchema],
    likes: Number
});

const Remark = mongoose.model('Remark', remarkSchema);

module.exports = Remark;
