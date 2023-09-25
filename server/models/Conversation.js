const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    title: String,
    remarks: [{ type: Schema.Types.ObjectId, ref: 'Remark' }],
    topics: [String]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;