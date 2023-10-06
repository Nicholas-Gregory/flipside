const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    remark: { type: Schema.Types.ObjectId, ref: 'Remark' },
    body: {
        type: String
    },
    parent: { type: Schema.Types.ObjectId, ref: 'Comment' },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    likes: Number,
    author: { type: String }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;