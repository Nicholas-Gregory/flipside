const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require('graphql');
const { Types } = require('mongoose');

const models = require('../models');

const comment = new GraphQLObjectType({
    name: 'comment',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        replies: {
            type: new GraphQLList(comment),
            resolve: async comment => (await models.Comment.findById(new Types.ObjectId(comment.id))
            .populate('replies'))
            .replies
        },
        parent: {
            type: comment
        },
        likes: {
            type: GraphQLInt
        }
    })
})

const citation = new GraphQLObjectType({
    name: 'citation',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        text: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        link: {
            type: GraphQLString
        },
        remark: {
            type: remark,
            resolve: async citation => citation.parent()
        }
    })
});

const remark = new GraphQLObjectType({
    name: 'remark',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        conversation: {
            type: conversation,
            resolve: async remark => await models.Conversation.findById(remark.conversation)
        },
        author: {
            type: user,
            resolve: async remark => await models.User.findById(remark.author)
        },
        body: {
            type: GraphQLString
        },
        comments: {
            type: new GraphQLList(comment),
            resolve: async remark => (await models.Remark.findById(remark.id)
            .populate('comments'))
            .comments
        },
        quote: {
            type: remark,
            resolve: async remark => await models.Remark.findById(remark.quote)
        },
        citations: {
            type: new GraphQLList(citation)
        },
        likes: {
            type: GraphQLInt
        }
    })
})

const conversation = new GraphQLObjectType({
    name: 'conversation',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        participants: {
            type: new GraphQLList(user),
            resolve: async conversation => (await models.Conversation.findById(conversation.id)
            .populate('participants'))
            .participants
        },
        title: {
            type: GraphQLString
        },
        remarks: {
            type: new GraphQLList(remark),
            resolve: async conversation => (await models.Conversation.findById(conversation.id)
            .populate('remarks'))
            .remarks
        },
        topics: {
            type: new GraphQLList(GraphQLString)
        }
    })
});

const user = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        bio: {
            type: GraphQLString
        },
        friends: {
            type: new GraphQLList(user),
            resolve: async user => (await models.User.findById(user._id)
            .populate('friends'))
            .friends
        },
        incomingFriendRequests: {
            type: new GraphQLList(user),
            resolve: async user => (await models.User.findById(user._id)
            .populate('incomingFriendRequests'))
            .incomingFriendRequests
        },
        outgoingFriendRequests: {
            type: new GraphQLList(user),
            resolve: async user => (await models.User.findById(user._id)
            .populate('outgoingFriendRequests'))
            .outgoingFriendRequests
        },
        conversations: {
            type: new GraphQLList(conversation),
            resolve: async user => (await models.User.findById(user._id)
            .populate('conversations'))
            .conversations
        }
    })
});

module.exports = {
    user, conversation, remark,
    citation, comment
}